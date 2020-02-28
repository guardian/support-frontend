package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import admin.settings.{AllSettingsProvider, SettingsSurrogateKeySyntax}
import cats.data.EitherT
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.workers.{BillingPeriod, User}
import io.circe.syntax._
import lib.PlayImplicits._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{IdentityService, TestUserService}
import utils.NormalisedTelephoneNumber.asFormattedString
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber}

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
        handleCreateSupportWorkersRequest(request, CheckoutValidationRules.validatorFor(request.body.product))
    }

  def handleCreateSupportWorkersRequest(
    implicit request: AuthRequest[CreateSupportWorkersRequest],
    validator: CreateSupportWorkersRequest => Boolean
  ): Future[Result] = {
    SafeLogger.info(s"[${request.uuid}] User ${request.user.minimalUser.id} is attempting to create a new ${request.body.product} subscription")

    val normalisedTelephoneNumber = NormalisedTelephoneNumber.fromStringAndCountry(request.body.telephoneNumber, request.body.billingAddress.country)

    val createSupportWorkersRequest = request.body.copy(
      telephoneNumber = normalisedTelephoneNumber.map(asFormattedString)
    )

    def subscriptionStatusOrError(idUser: IdUser): ApiResponseOrError[StatusResponse] = {
      client.createSubscription(request, createUser(idUser, createSupportWorkersRequest), request.uuid).leftMap(error => ServerError(error.toString))
    }

    if (validator(createSupportWorkersRequest)) {
      val userOrError: ApiResponseOrError[IdUser] = identityService.getUser(request.user.minimalUser).leftMap(ServerError(_))

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
      isTestUser = testUsers.isTestUser(user.publicFields.username),
      deliveryInstructions = request.deliveryInstructions
    )
  }

  protected def respondToClient(
    result: EitherT[Future, CreateSubscriptionError, StatusResponse],
    billingPeriod: BillingPeriod
 )(implicit request: AuthRequest[CreateSupportWorkersRequest]): Future[Result] = {
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
        Accepted(statusResponse.asJson)
      }
    )
  }
}

