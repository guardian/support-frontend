package services.stepfunctions

import java.util.UUID

import actions.CustomActionBuilders.AnyAuthRequest
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.stepfunctions.model.StateExitedEventDetails
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.states.{CheckoutFailureState, CreatePaymentMethodState}
import com.gu.support.workers.{Status, _}
import monitoring.SafeLogger
import monitoring.SafeLogger._
import ophan.thrift.event.AbTest
import play.api.mvc.Call
import services.stepfunctions.SupportWorkersClient._
import services.stepfunctions.PaymentFieldsEmbellisher._

import scala.concurrent.Future
import scala.util.matching.Regex
import scala.util.{Failure, Success, Try}

object CreateSupportWorkersRequest {
  import codecs.CirceDecoders._
  implicit val codec: Codec[CreateSupportWorkersRequest] = deriveCodec
}
case class CreateSupportWorkersRequest(
    firstName: String,
    lastName: String,
    addressLine1: Option[String],
    addressLine2: Option[String],
    townCity: Option[String],
    county: Option[String],
    postcode: Option[String],
    country: Country,
    state: Option[String],
    product: ProductType,
    paymentFields: PaymentFields,
    promoCode: Option[PromoCode],
    ophanIds: OphanIds,
    referrerAcquisitionData: ReferrerAcquisitionData,
    supportAbTests: Set[AbTest],
    email: String,
    telephoneNumber: Option[String]
)

object SupportWorkersClient {
  sealed trait SupportWorkersError
  case object StateMachineFailure extends SupportWorkersError

  def apply(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    call: String => Call
  )(implicit system: ActorSystem): SupportWorkersClient =
    new SupportWorkersClient(arn, stateWrapper, supportUrl, call)
}

case class StatusResponse(
    status: Status,
    trackingUri: String,
    failureReason: Option[CheckoutFailureReason] = None,
    guestAccountCreationToken: Option[String] = None
)

object StatusResponse {
  def fromStatusResponseAndToken(statusResponse: StatusResponse, token: Option[String]): StatusResponse =
    StatusResponse(statusResponse.status, statusResponse.trackingUri, statusResponse.failureReason, token)

  implicit val codec: Codec[StatusResponse] = deriveCodec
}

class SupportWorkersClient(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    statusCall: String => Call
)(implicit system: ActorSystem) {
  private implicit val sw = stateWrapper
  private implicit val ec = system.dispatcher
  private val underlying = Client(arn)

  private def referrerAcquisitionDataWithGAFields(request: AnyAuthRequest[CreateSupportWorkersRequest]): ReferrerAcquisitionData = {
    val hostname = request.host
    val gaClientId = request.cookies.get("_ga").map(_.value)
    val userAgent = request.headers.get("user-agent")
    val ipAddress = request.remoteAddress
    request.body.referrerAcquisitionData.copy(hostname = Some(hostname), gaClientId = gaClientId, userAgent = userAgent, ipAddress = Some(ipAddress))
  }

  def createSubscription(
    request: AnyAuthRequest[CreateSupportWorkersRequest],
    user: User,
    requestId: UUID,
    promoCode: Option[PromoCode] = None
  ): EitherT[Future, SupportWorkersError, StatusResponse] = {

    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      product = request.body.product,
      paymentFields = paymentFields(request.body),
      acquisitionData = Some(AcquisitionData(
        ophanIds = request.body.ophanIds,
        referrerAcquisitionData = referrerAcquisitionDataWithGAFields(request),
        supportAbTests = request.body.supportAbTests
      )),
      promoCode = request.body.promoCode
    )
    underlying.triggerExecution(createPaymentMethodState, user.isTestUser).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] Failed to trigger Step Function execution for ${user.id} - $error")
        StateMachineFailure: SupportWorkersError
      },
      { success =>
        SafeLogger.info(s"[$requestId] Successfully triggered Step Function execution for ${user.id} ($success)")
        underlying.jobIdFromArn(success.arn).map { jobId =>
          StatusResponse(
            status = Status.Pending,
            trackingUri = supportUrl + statusCall(jobId).url
          )
        } getOrElse {
          SafeLogger.error(scrub"[$requestId] Failed to parse ${success.arn} to a jobId after triggering Step Function execution for ${user.id} $request")
          StatusResponse(
            status = Status.Failure,
            trackingUri = "",
            failureReason = Some(CheckoutFailureReasons.Unknown)
          )
        }

      }
    )
  }

  def status(jobId: String, requestId: UUID): EitherT[Future, SupportWorkersError, StatusResponse] = {

    def respondToClient(statusResponse: StatusResponse): StatusResponse = {
      SafeLogger.info(s"[$requestId] Client is polling for status - the current status for execution $jobId is: ${statusResponse}")
      statusResponse
    }

    underlying.history(jobId).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] failed to get status of step function execution $jobId: $error")
        StateMachineFailure: SupportWorkersError
      },
      { events =>
        val trackingUri = supportUrl + statusCall(jobId).url
        val detailedHistory = events.map(event => Try(event.getStateExitedEventDetails))
        respondToClient(StepFunctionExecutionStatus.checkoutStatus(detailedHistory, stateWrapper, trackingUri))
      }
    )

  }

  def healthy(): Future[Boolean] =
    underlying.status.map(_.getStatus == "ACTIVE").getOrElse(false)

}

object StepFunctionExecutionStatus {

  def checkoutStatus(detailedHistory: List[Try[StateExitedEventDetails]], stateWrapper: StateWrapper, trackingUri: String): StatusResponse = {

    val searchForFinishedCheckout: Option[StatusResponse] = detailedHistory.collectFirst {
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("CheckoutSuccess") =>
        StatusResponse(Status.Success, trackingUri, None)
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("SucceedOrFailChoice") =>
        StatusResponse(Status.Failure, trackingUri, getFailureDetails(stateWrapper, detailsAttempt.get))
    }

    searchForFinishedCheckout.getOrElse(StatusResponse(Status.Pending, trackingUri, None))

  }

  def getFailureDetails(stateWrapper: StateWrapper, eventDetails: StateExitedEventDetails): Option[CheckoutFailureReason] = {
    SafeLogger.info(s"Event details are: $eventDetails")
    stateWrapper.unWrap[CheckoutFailureState](eventDetails.getOutput) match {
      case Success(checkoutFailureState) =>
        Some(checkoutFailureState.checkoutFailureReason)
      case Failure(error) =>
        SafeLogger.error(scrub"Failed to determine checkout failure reason due to $error")
        None
    }

  }

}

object PaymentFieldsEmbellisher {

  case class AddressLine(streetNumber: Option[String], streetName: String)

  def combinedAddressLine(addressLine1: Option[String], addressLine2: Option[String]): Option[AddressLine] = {

    def singleAddressLine(addressLine1: String): AddressLine = {
      val pattern: Regex = "([0-9]+) (.+)".r

      addressLine1 match {
        case pattern(streetNumber, streetName) => AddressLine(Some(streetNumber), streetName)
        case _ => AddressLine(None, addressLine1)
      }
    }

    val addressLine1MaybeSplit: Option[AddressLine] = addressLine1.map(singleAddressLine(_))
    val addressLine2MaybeSplit: Option[AddressLine] = addressLine2.map(singleAddressLine(_))

    def concatStreetNames(firstStreetName: String, secondStreetName: String): String = s"$firstStreetName, $secondStreetName"

    val combinedLine = (addressLine1MaybeSplit, addressLine2MaybeSplit) match {
      case (None, None) => None
      case (Some(line1), None) => Some(line1)
      case (None, Some(line2)) => Some(line2)
      case (Some(line1), Some(line2)) => {
        if(line1.streetNumber.isDefined) {
          Some(AddressLine(line1.streetNumber, concatStreetNames(line1.streetName, line2.streetName)))
        }
        else if(line2.streetNumber.isDefined){
          Some(AddressLine(line2.streetNumber, concatStreetNames(line2.streetName, line1.streetName)))
        }
        else {
          Some(AddressLine(None, concatStreetNames(line1.streetName, line2.streetName)))
        }
      }
    }

    combinedLine map { line =>
      if (line.streetName.length > 100) {
        //we are sometimes putting extra info into streetName but zuora's character limit is 100
        AddressLine(line.streetNumber, line.streetName.take(100))
      }
      else line
    }
  }

  def paymentFields(request: CreateSupportWorkersRequest): PaymentFields = {
    request.paymentFields match {
      case dd: DirectDebitPaymentFields => {
        val addressLine: Option[AddressLine] = combinedAddressLine(request.addressLine1, request.addressLine2)
        DirectDebitPaymentFields(
          accountHolderName = dd.accountHolderName,
          sortCode = dd.sortCode,
          accountNumber = dd.accountNumber,
          city = request.townCity,
          postalCode = request.postcode,
          state = request.state,
          streetName = addressLine.map(_.streetName),
          streetNumber = addressLine.flatMap(_.streetNumber)
        )
      }
      case pf: PaymentFields => pf
    }
  }

}

