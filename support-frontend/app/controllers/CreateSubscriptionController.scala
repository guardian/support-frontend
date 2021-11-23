package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.{AuthRequest, OptionalAuthRequest}
import admin.settings.{AllSettingsProvider, SettingsSurrogateKeySyntax}
import akka.stream.scaladsl.Flow
import akka.util.ByteString
import cats.data.EitherT
import cats.implicits._
import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.config.Stage
import com.gu.support.workers.{BillingPeriod, Contribution, DigitalPack, GuardianWeekly, Paper, User}
import config.Configuration.GuardianDomain
import cookies.DigitalSubscriptionCookies
import io.circe.syntax._
import lib.PlayImplicits._
import play.api.libs.circe.Circe
import play.api.libs.streams.Accumulator
import play.api.mvc._
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{AuthenticatedIdUser, IdMinimalUser, IdentityService, TestUserService}
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.NormalisedTelephoneNumber.asFormattedString
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber}

import scala.concurrent.{ExecutionContext, Future}

class CreateSubscriptionController(
  client: SupportWorkersClient,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  components: ControllerComponents,
  val supportUrl: String,
  val guardianDomain: GuardianDomain,
  stage: Stage
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  sealed abstract class CreateSubscriptionError(message: String)
  case class ServerError(message: String) extends CreateSubscriptionError(message)
  case class RequestValidationError(message: String) extends CreateSubscriptionError(message)

  type ApiResponseOrError[RES] = EitherT[Future, CreateSubscriptionError, RES]

  def create: EssentialAction =
    alarmOnFailure(maybeAuthenticatedAction().async(new LoggingCirceParser(components).requestParser) {
      implicit request =>
        request.user match {
          case Some(user) =>
            SafeLogger.info(s"User ${user.minimalUser.id} is attempting to create a new ${request.body.product} subscription [${request.uuid}]")
            handleCreateSupportWorkersRequest(user.minimalUser)
          case None =>
            SafeLogger.info(s"Guest user ${request.body.email} is attempting to create a new ${request.body.product} subscription [${request.uuid}]")
            createGuestUserAndHandleRequest.getOrElse(InternalServerError)
        }
    })

  def createGuestUserAndHandleRequest(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]): EitherT[Future, String, Result] =
    for {
      userId <- identityService.getOrCreateUserIdFromEmail(request.body.email, request.body.firstName, request.body.lastName)
      result <- EitherT.right[String](
        handleCreateSupportWorkersRequest(IdMinimalUser(userId, None))
      )
    } yield result

  def handleCreateSupportWorkersRequest(idMinimalUser: IdMinimalUser)(
    implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]
  ): Future[Result] = {

    val normalisedTelephoneNumber = NormalisedTelephoneNumber.fromStringAndCountry(request.body.telephoneNumber, request.body.billingAddress.country)

    val createSupportWorkersRequest = request.body.copy(
      telephoneNumber = normalisedTelephoneNumber.map(asFormattedString)
    )

    def subscriptionStatusOrError(idUser: IdUser): ApiResponseOrError[StatusResponse] = {
      val isTestUser = testUsers.isTestUser(request)
      client.createSubscription(request, createUser(idUser, createSupportWorkersRequest, isTestUser), request.uuid)
        .leftMap(error => ServerError(error.toString))
    }

    CheckoutValidationRules.validate(createSupportWorkersRequest) match {
      case Valid =>
        val userOrError: ApiResponseOrError[IdUser] = identityService.getUser(idMinimalUser).leftMap(ServerError)

        val result: ApiResponseOrError[StatusResponse] = for {
          user <- userOrError
          statusResponse <- subscriptionStatusOrError(user)
        } yield statusResponse

        respondToClient(result, createSupportWorkersRequest.product.billingPeriod)
      case Invalid(message) =>
        SafeLogger.warn(s"validation of the request body failed with $message - body was $createSupportWorkersRequest")
        respondToClient(EitherT.leftT(RequestValidationError("validation of the request body failed")), createSupportWorkersRequest.product.billingPeriod)
    }
  }

  private def createUser(user: IdUser, request: CreateSupportWorkersRequest, isTestUser: Boolean) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      title = request.title,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = request.billingAddress,
      deliveryAddress = request.deliveryAddress,
      telephoneNumber = request.telephoneNumber,
      allowMembershipMail = false,
      // Previously the values for the fields allowThirdPartyMail and allowGURelatedMail
      // were derived by looking for the fields: statusFields.receive3rdPartyMarketing and
      // statusFields.receiveGnmMarketing in the JSON object that models a user.
      // However, a query of the identity database indicates that these fields aren't defined for any users
      // (nor are they included in the StatusFields class in identity-model).
      // Therefore, setting them statically to false is not a regression.
      // TODO: in a subsequent PR set these values based on the respective user.
      allowThirdPartyMail = false,
      allowGURelatedMail = false,
      isTestUser = isTestUser,
      deliveryInstructions = request.deliveryInstructions
    )
  }

  protected def respondToClient(
    result: EitherT[Future, CreateSubscriptionError, StatusResponse],
    billingPeriod: BillingPeriod
 )(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]): Future[Result] = {
    val product = request.body.product.describe
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new $billingPeriod $product subscription, due to $error")
        error match {
          case _: RequestValidationError => BadRequest
          case _: ServerError => InternalServerError
        }
      },
      { statusResponse =>
        SafeLogger.info(s"[${request.uuid}] Successfully created a support workers execution for a new $billingPeriod $product subscription")
        Accepted(statusResponse.asJson).withCookies(DigitalSubscriptionCookies.create(guardianDomain):_*)
      }
    )
  }
}

class LoggingCirceParser(controllerComponents: ControllerComponents) extends Circe {

  val requestParser: BodyParser[CreateSupportWorkersRequest] = {
    val underlying = circe.json[CreateSupportWorkersRequest]
    BodyParser.apply("LoggingCirceParser(" + underlying.toString() + ")") {
      requestHeader: RequestHeader =>
        val accumulator: Accumulator[ByteString, Either[Result, CreateSupportWorkersRequest]] = underlying.apply(requestHeader)
        accumulator.through(Flow.fromFunction { (byteString: ByteString) =>
          SafeLogger.info("incoming POST: " + byteString.utf8String)
          byteString
        })
    }
  }

  def parse: PlayBodyParsers = controllerComponents.parsers
}
