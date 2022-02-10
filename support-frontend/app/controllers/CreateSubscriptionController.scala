package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.workers._
import config.Configuration.GuardianDomain
import controllers.CreateSubscriptionController._
import io.circe.syntax._
import lib.PlayImplicits._
import models.identity.responses.IdentityErrorResponse.IdentityError
import models.identity.responses.IdentityErrorResponse.IdentityError.InvalidEmailAddress
import org.joda.time.DateTime
import play.api.libs.circe.Circe
import play.api.mvc._
import services.AsyncAuthenticationService.IdentityIdAndEmail
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{IdentityService, TestUserService}
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.chaining._

object CreateSubscriptionController {

  sealed abstract class CreateSubscriptionError(message: String)
  case class ServerError(message: String) extends CreateSubscriptionError(message)
  case class RequestValidationError(message: String) extends CreateSubscriptionError(message)

  type ApiResponseOrError[RES] = EitherT[Future, CreateSubscriptionError, RES]

}

class CreateSubscriptionController(
    client: SupportWorkersClient,
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    testUsers: TestUserService,
    components: ControllerComponents,
    guardianDomain: GuardianDomain,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with Circe {

  import actionRefiners._

  def create: EssentialAction =
    LoggingAndAlarmOnFailure {
      MaybeAuthenticatedAction.async(circe.json[CreateSupportWorkersRequest]) { implicit request =>
        val maybeLoggedInIdentityIdAndEmail =
          request.user.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))
        logIncomingRequest(request, maybeLoggedInIdentityIdAndEmail)

        val errorOrStatusResponse = for {
          userAndEmail <- maybeLoggedInIdentityIdAndEmail match {
            case Some(identityIdAndEmail) => EitherT.pure[Future, CreateSubscriptionError](identityIdAndEmail)
            case None => getOrCreateIdentityUser(request.body).leftMap(mapIdentityErrorToCreateSubscriptionError)
          }
          _ <- validate(request)
          supportWorkersUser = buildSupportWorkersUser(userAndEmail, request.body, testUsers.isTestUser(request))
          statusResponse <- client
            .createSubscription(request, supportWorkersUser, request.uuid)
            .leftMap[CreateSubscriptionError](ServerError)
        } yield statusResponse

        toHttpResponse(errorOrStatusResponse, request.body.product)

      }
    }

  private def mapIdentityErrorToCreateSubscriptionError(identityError: IdentityError) =
    if (IdentityError.isDisallowedEmailError(identityError))
      RequestValidationError(InvalidEmailAddress.errorReasonCode)
    else
      ServerError(identityError.description)

  private def logIncomingRequest(
      request: OptionalAuthRequest[CreateSupportWorkersRequest],
      maybeLoggedInIdentityIdAndEmail: Option[IdentityIdAndEmail],
  ) = {
    val userDesc = maybeLoggedInIdentityIdAndEmail match {
      case None => s"Guest User ${request.body.email}"
      case Some(idAndEmail) => s"User ${idAndEmail.primaryEmailAddress}"
    }
    SafeLogger.info(s"$userDesc is attempting to create a new ${request.body.product.describe} [${request.uuid}]")
  }

  private def getOrCreateIdentityUser(
      body: CreateSupportWorkersRequest,
  ): EitherT[Future, IdentityError, IdentityIdAndEmail] = {
    val existingIdentityId = identityService.getUserIdFromEmail(body.email)
    val identityId =
      existingIdentityId.leftFlatMap(_ =>
        identityService.createUserIdFromEmailUser(body.email, body.firstName, body.lastName),
      )
    identityId.map(identityId => IdentityIdAndEmail(identityId, body.email))
  }

  private def validate(request: Request[CreateSupportWorkersRequest]): EitherT[Future, CreateSubscriptionError, Unit] =
    CheckoutValidationRules.validate(request.body) match {
      case Valid => EitherT.pure(())
      case Invalid(message) => EitherT.leftT(RequestValidationError(message))
    }

  private def toHttpResponse(
      result: EitherT[Future, CreateSubscriptionError, StatusResponse],
      product: ProductType,
  )(implicit request: Request[CreateSupportWorkersRequest]): Future[Result] = {
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new ${request.body.product.describe}, due to $error")
        error match {
          case err: RequestValidationError => BadRequest(err.message)
          case _: ServerError => InternalServerError
        }
      },
      { statusResponse =>
        SafeLogger.info(
          s"[${request.uuid}] Successfully created a support workers execution for a new ${request.body.product.describe}",
        )
        Accepted(statusResponse.asJson).withCookies(cookies(product): _*)
      },
    )
  }

  private def cookies(product: ProductType) = {
    // Setting the user attributes cookies used by frontend. See:
    // https://github.com/guardian/frontend/blob/main/static/src/javascripts/projects/common/modules/commercial/user-features.js#L69
    val standardCookies = List(
      "gu_user_features_expiry" -> DateTime.now.plusDays(1).getMillis.toString,
      "gu_hide_support_messaging" -> true.toString,
    )
    val productCookies = product match {
      case Contribution(_, _, billingPeriod) =>
        List(
          s"gu.contributions.recurring.contrib-timestamp.$billingPeriod" -> DateTime.now.getMillis.toString,
          "gu_recurring_contributor" -> true.toString,
        )
      case _: DigitalPack =>
        List(
          "gu_digital_subscriber" -> true.toString,
          "GU_AF1" -> DateTime.now().plusDays(1).getMillis.toString,
        )
      case p: Paper if p.productOptions.hasDigitalSubscription =>
        List(
          "gu_digital_subscriber" -> true.toString,
          "GU_AF1" -> DateTime.now().plusDays(1).getMillis.toString,
        )
      case _: Paper => List.empty
      case _: GuardianWeekly => List.empty
    }
    (standardCookies ++ productCookies).map { case (name, value) =>
      Cookie(
        name = name,
        value = value,
        secure = true,
        httpOnly = false,
        domain = Some(guardianDomain.value),
      )
    }
  }

  private def buildSupportWorkersUser(
      identityIdAndEmail: IdentityIdAndEmail,
      request: CreateSupportWorkersRequest,
      isTestUser: Boolean,
  ) = {
    User(
      id = identityIdAndEmail.id,
      primaryEmailAddress = identityIdAndEmail.primaryEmailAddress,
      title = request.title,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = request.billingAddress,
      deliveryAddress = request.deliveryAddress,
      telephoneNumber = for {
        phoneNo <- request.telephoneNumber
        updatedNo <- NormalisedTelephoneNumber
          .formatFromStringAndCountry(phoneNo, request.billingAddress.country)
          .tap(_.left.foreach(SafeLogger.warn))
          .toOption
      } yield updatedNo,
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
      deliveryInstructions = request.deliveryInstructions,
    )
  }

}
