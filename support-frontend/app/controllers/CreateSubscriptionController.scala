package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import akka.actor.{ActorSystem, Scheduler}
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.workers._
import config.Configuration.GuardianDomain
import controllers.CreateSubscriptionController._
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._
import io.circe.syntax._
import lib.PlayImplicits._
import models.identity.responses.IdentityErrorResponse.IdentityError
import models.identity.responses.IdentityErrorResponse.IdentityError.InvalidEmailAddress
import org.joda.time.DateTime
import play.api.http.Writeable
import play.api.libs.circe.Circe
import play.api.mvc._
import services.AsyncAuthenticationService.IdentityIdAndEmail
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{IdentityService, TestUserService}
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.{Failure, Success}
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
)(implicit val ec: ExecutionContext, system: ActorSystem)
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

        toHttpResponse(errorOrStatusResponse, request.body.product, request.body.email)

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
    implicit val scheduler: Scheduler = system.scheduler
    val identityId = identityService.getOrCreateUserFromEmail(body.email, body.firstName, body.lastName)

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
      userEmail: String,
  )(implicit request: Request[CreateSupportWorkersRequest], writeable: Writeable[String]): Future[Result] = {
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new ${request.body.product.describe}, due to $error")
        error match {
          case err: RequestValidationError =>
            // Store the error message in the result.header.reasonPhrase this will allow us to
            // avoid alerting for disallowed email addresses in LoggingAndAlarmOnFailure
            Result(
              header = new ResponseHeader(
                status = BAD_REQUEST,
                reasonPhrase = Some(err.message),
              ),
              body = writeable.toEntity(err.message),
            )
          case _: ServerError =>
            InternalServerError
        }
      },
      { statusResponse =>
        SafeLogger.info(
          s"[${request.uuid}] Successfully created a support workers execution for a new ${request.body.product.describe}",
        )
        Accepted(statusResponse.asJson).withCookies(cookies(product, userEmail): _*)
      },
    )
  }

  case class CheckoutCompleteCookieBody(
      userType: String,
      product: String,
  )
  object CheckoutCompleteCookieBody {
    implicit val encoder: Encoder[CheckoutCompleteCookieBody] =
      deriveEncoder[CheckoutCompleteCookieBody]
  }
  private def checkoutCompleteCookies(productType: ProductType, userEmail: String): List[Cookie] = {
    val pendingUserType: Future[Option[String]] = identityService.getUserType(userEmail).fold(
      err => {
        SafeLogger.error(scrub"Failed to retrieve user type for $userEmail: $err")
        None
      },
      response => {
        SafeLogger.info(s"Successfully retrieved user type for $userEmail")
        SafeLogger.info(s"USERTYPE: ${response.userType}")
        Some(response.userType)
      },
    )

    Await.result(pendingUserType, Duration(2, SECONDS)) match {
      case Some(userType) =>
        List(Cookie(
          name = "GU_CO_COMPLETE",
          value = CheckoutCompleteCookieBody(
            userType = userType,
            product = productType.toString,
          ).asJson.noSpaces,
          maxAge = Some(1209600), // fourteen days
          secure = true,
          httpOnly = false,
          domain = Some(guardianDomain.value)
        ))
      case None => List.empty
    }
  }

  private def cookies(product: ProductType, userEmail: String) = {
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

    val standardAndProductCookies = (standardCookies ++ productCookies).map { case (name, value) =>
      Cookie(
        name = name,
        value = value,
        secure = true,
        httpOnly = false,
        domain = Some(guardianDomain.value)
      )
    }

    standardAndProductCookies ++ checkoutCompleteCookies(product, userEmail)
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
      isTestUser = isTestUser,
      deliveryInstructions = request.deliveryInstructions,
    )
  }

}
