package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import admin.settings.{AllSettingsProvider, SettingsSurrogateKeySyntax}
import cats.data.EitherT
import cats.implicits._
import com.gu.identity.play.IdUser
import com.gu.support.workers.{Address, BillingPeriod, DigitalPack, User}
import io.circe.syntax._
import lib.PlayImplicits._
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{IdentityService, TestUserService}
import utils.NormalisedTelephoneNumber
import utils.NormalisedTelephoneNumber.asFormattedString
import utils.SimpleValidator._

import scala.concurrent.{ExecutionContext, Future}

class CreateSubscription(
  client: SupportWorkersClient,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  components: ControllerComponents,
  settingsProvider: AllSettingsProvider,
  val supportUrl: String
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  sealed abstract class CreateSubscriptionError(message: String)
  case class ServerError(message: String) extends CreateSubscriptionError(message)
  case class RequestValidationError(message: String) extends CreateSubscriptionError(message)

  type ApiResponseOrError[RES] = EitherT[Future, CreateSubscriptionError, RES]

  def create: Action[CreateSupportWorkersRequest] =
    authenticatedAction(recurringIdentityClientId).async(circe.json[CreateSupportWorkersRequest]) {
      implicit request: AuthRequest[CreateSupportWorkersRequest] =>
        val validator: CreateSupportWorkersRequest => Boolean = request.body.product match {
          case digitalPack: DigitalPack => validationPasses
          case _ => validationPasses // TODO use a different validator which encompasses HD/Voucher rules
        }
        handleCreateSupportWorkersRequest(request, validator)
    }

  def handleCreateSupportWorkersRequest(
    implicit request: AuthRequest[CreateSupportWorkersRequest],
    validator: CreateSupportWorkersRequest => Boolean
  ): Future[Result] = {
    SafeLogger.info(s"[${request.uuid}] User ${request.user.id} is attempting to create a new subscription")

    val normalisedTelephoneNumber = NormalisedTelephoneNumber.fromStringAndCountry(request.body.telephoneNumber, request.body.country)

    val createSupportWorkersRequest = request.body.copy(
      telephoneNumber = normalisedTelephoneNumber.map(asFormattedString)
    )

    def subscriptionStatusOrError(idUser: IdUser): ApiResponseOrError[StatusResponse] = {
      client.createSubscription(request, createUser(idUser, createSupportWorkersRequest), request.uuid).leftMap(error => ServerError(error.toString))
    }

    if (validator(createSupportWorkersRequest)) {
      val userOrError: ApiResponseOrError[IdUser] = identityService.getUser(request.user).leftMap(ServerError(_))

      val result: ApiResponseOrError[StatusResponse] = for {
        user <- userOrError
        statusResponse <- subscriptionStatusOrError(user)
      } yield statusResponse

      respondToClient(result, createSupportWorkersRequest.product.billingPeriod)
    } else {
      respondToClient(EitherT.leftT(RequestValidationError("validation of the request body failed")), createSupportWorkersRequest.product.billingPeriod)
    }
  }

  private def createUser(user: IdUser, request: CreateSupportWorkersRequest) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = billingAddress(request),
      telephoneNumber = request.telephoneNumber,
      allowMembershipMail = false,
      allowThirdPartyMail = user.statusFields.flatMap(_.receive3rdPartyMarketing).getOrElse(false),
      allowGURelatedMail = user.statusFields.flatMap(_.receiveGnmMarketing).getOrElse(false),
      isTestUser = testUsers.isTestUser(user.publicFields.displayName)
    )
  }

  private def billingAddress(request: CreateSupportWorkersRequest): Address = {
    Address(
      lineOne = request.addressLine1,
      lineTwo = request.addressLine2,
      city = request.townCity,
      state = request.state,
      postCode = request.postcode,
      country = request.country
    )
  }

  protected def respondToClient(
    result: EitherT[Future, CreateSubscriptionError, StatusResponse],
    billingPeriod: BillingPeriod
 )(implicit request: AuthRequest[CreateSupportWorkersRequest]): Future[Result] =
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new $billingPeriod subscription, due to $error")
        error match {
          case _: RequestValidationError => BadRequest
          case _: ServerError => InternalServerError
        }
      },
      { statusResponse =>
        SafeLogger.info(s"[${request.uuid}] Successfully created a support workers execution for a new $billingPeriod subscription")
        Accepted(statusResponse.asJson)
      }
    )

}

