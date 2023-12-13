package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, Switches}
import akka.actor.{ActorSystem, Scheduler}
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.NationalDelivery
import com.gu.support.paperround.PaperRoundServiceProvider
import com.gu.support.workers._
import config.Configuration.GuardianDomain
import config.RecaptchaConfigProvider
import controllers.CreateSubscriptionController._
import io.circe.Encoder
import io.circe.generic.semiauto._
import io.circe.syntax._
import lib.PlayImplicits._
import models.identity.responses.IdentityErrorResponse.IdentityError
import models.identity.responses.IdentityErrorResponse._
import org.joda.time.DateTime
import play.api.http.Writeable
import play.api.libs.circe.Circe
import play.api.mvc._
import services.AsyncAuthenticationService.IdentityIdAndEmail
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{IdentityService, RecaptchaResponse, RecaptchaService, StripeSetupIntentService, TestUserService}
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber, PaperValidation}

import java.net.URLEncoder
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
    recaptchaService: RecaptchaService,
    recaptchaConfigProvider: RecaptchaConfigProvider,
    settingsProvider: AllSettingsProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    guardianDomain: GuardianDomain,
    paperRoundServiceProvider: PaperRoundServiceProvider,
)(implicit val ec: ExecutionContext, system: ActorSystem)
    extends AbstractController(components)
    with Circe {

  import actionRefiners._

  // This is just for readability
  private type CreateRequest = OptionalAuthRequest[CreateSupportWorkersRequest]

  def create: EssentialAction =
    LoggingAndAlarmOnFailure {
      MaybeAuthenticatedActionOnFormSubmission.async(circe.json[CreateSupportWorkersRequest]) { implicit request =>
        implicit val settings: AllSettings = settingsProvider.getAllSettings()

        logDetailedMessage("attempting to create")
        val json = request.body.copy(debugInfo = None).asJson
        logDetailedMessage(json.toString)

        // Only Direct Debit requests include a recaptchaToken.
        // For Stripe payments, recaptcha validation is done earlier in the flow
        val recaptchaToken =
          request.body.paymentFields match {
            case Left(dd: DirectDebitPaymentFields) => Some(dd.recaptchaToken)
            case _ => None
          }

        val errorOrStatusResponse = for {
          _ <- recaptchaToken match {
            case Some(token) => validateRecaptcha(token, testUsers.isTestUser(request))
            case None => EitherT.rightT[Future, RequestValidationError](())
          }
          result <- createSubscription
        } yield result

        toHttpResponse(errorOrStatusResponse, request.body.product, request.body.email)

      }
    }

  // Returns a Right if validation succeeds
  private def validateRecaptcha(token: String, isTestUser: Boolean)(implicit
      settings: AllSettings,
      request: CreateRequest,
  ): EitherT[Future, RequestValidationError, Unit] = {
    val recaptchaBackendEnabled =
      settings.switches.recaptchaSwitches.enableRecaptchaBackend.isOn
    val recaptchaFrontendEnabled =
      settings.switches.recaptchaSwitches.enableRecaptchaFrontend.isOn
    // We never validate on backend unless frontend validation is Enabled
    val recaptchaEnabled = recaptchaFrontendEnabled && recaptchaBackendEnabled

    val v2RecaptchaSecretKey = recaptchaConfigProvider.get(isTestUser).v2SecretKey

    if (recaptchaEnabled) {
      recaptchaService
        .verify(token, v2RecaptchaSecretKey)
        .leftMap(err => RequestValidationError(err))
        .subflatMap {
          case RecaptchaResponse(true, _) => Right(())

          case RecaptchaResponse(false, _) =>
            errorDetailedMessage("recaptcha failed")
            Left(RequestValidationError("Recaptcha validation failed"))
        }
    } else {
      EitherT.rightT(())
    }
  }

  private def createSubscription(implicit
      settings: AllSettings,
      request: CreateRequest,
  ): EitherT[Future, CreateSubscriptionError, StatusResponse] = {
    val maybeLoggedInIdentityIdAndEmail =
      request.user.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))

    logDetailedMessage("createSubscription")

    for {
      userAndEmail <- maybeLoggedInIdentityIdAndEmail match {
        case Some(identityIdAndEmail) => EitherT.pure[Future, CreateSubscriptionError](identityIdAndEmail)
        case None =>
          getOrCreateIdentityUser(request.body, request.headers.get("Referer"))
            .leftMap(mapIdentityErrorToCreateSubscriptionError)
      }
      _ <- validate(request, settings.switches)
      supportWorkersUser = buildSupportWorkersUser(userAndEmail, request.body, testUsers.isTestUser(request))
      statusResponse <- client
        .createSubscription(request, supportWorkersUser, request.uuid)
        .leftMap[CreateSubscriptionError](ServerError)
    } yield statusResponse
  }

  private def mapIdentityErrorToCreateSubscriptionError(identityError: IdentityError) =
    identityError match {
      case EmailProviderRejected(_endpoint) => RequestValidationError(emailProviderRejectedCode)
      case InvalidEmailAddress(_endpoint) => RequestValidationError(invalidEmailAddressCode)
      case OtherIdentityError(message, description, endpoint) =>
        endpoint match {
          case Some(GuestEndpoint) => ServerError(s"Error calling /guest: ${message}; ${description}")
          case Some(UserEndpoint) => ServerError(s"Error calling /user: ${message}; ${description}")
          case None => ServerError(s"${message}: ${description}")
        }
    }

  private def errorDetailedMessage(message: String)(implicit request: CreateRequest) = {
    val maybeLoggedInIdentityIdAndEmail =
      request.user.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))

    val userDesc = maybeLoggedInIdentityIdAndEmail match {
      case None => (request.body.email, "guest")
      case Some(idAndEmail) => (idAndEmail.primaryEmailAddress, "logged-in")
    }
    SafeLogger.error(
      scrub"[CreateSubscriptionController] [${request.uuid}] [${userDesc._1}] [${userDesc._2}] [${request.body.product.describe}] $message",
    )
  }

  private def logDetailedMessage(message: String)(implicit request: CreateRequest) = {
    val maybeLoggedInIdentityIdAndEmail =
      request.user.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))

    val (user, desc) = maybeLoggedInIdentityIdAndEmail match {
      case None => (request.body.email, "guest")
      case Some(idAndEmail) => (idAndEmail.primaryEmailAddress, "logged-in")
    }
    SafeLogger.info(
      s"[CreateSubscriptionController] [${request.uuid}] [$user] [$desc] [${request.body.product.describe}] $message",
    )
  }

  private def getOrCreateIdentityUser(
      body: CreateSupportWorkersRequest,
      referer: Option[String],
  ): EitherT[Future, IdentityError, IdentityIdAndEmail] = {
    implicit val scheduler: Scheduler = system.scheduler
    val identityId = identityService.getOrCreateUserFromEmail(
      body.email,
      body.firstName,
      body.lastName,
      body.ophanIds.pageviewId,
      referer,
    )

    identityId.map(identityId => IdentityIdAndEmail(identityId, body.email))
  }

  private def validate(
      request: Request[CreateSupportWorkersRequest],
      switches: Switches,
  ): EitherT[Future, CreateSubscriptionError, Unit] = {
    val validationResult = request.body.product match {
      case Paper(_, _, NationalDelivery, _, deliveryAgent) =>
        request.body.deliveryAddress match {
          case Some(Address(_, _, _, _, Some(postcode), _)) =>
            PaperValidation.deliveryAgentChosenWhichCoversPostcode(
              paperRoundServiceProvider.forUser(testUsers.isTestUser(request)),
              deliveryAgent,
              postcode,
            )
          case Some(Address(_, _, _, _, None, _)) => Future.successful(Invalid("No delivery postcode"))
          case None => Future.successful(Invalid("No delivery address"))
        }
      case _ => Future.successful(Valid)
    }
    EitherT(
      validationResult.map(deliveryAgentValid => {
        val paymentMethodEnabledValidation = CheckoutValidationRules
          .checkPaymentMethodEnabled(
            request.body.product,
            request.body.paymentFields,
            switches,
          )
        val validationRulesResult = CheckoutValidationRules.validate(request.body)

        paymentMethodEnabledValidation and validationRulesResult and deliveryAgentValid match {
          case Valid => Right(())
          case Invalid(message) => Left(RequestValidationError(message))
        }
      }),
    )
  }

  private def toHttpResponse(
      result: EitherT[Future, CreateSubscriptionError, StatusResponse],
      product: ProductType,
      userEmail: String,
  )(implicit request: CreateRequest, writeable: Writeable[String]): Future[Result] = {
    result
      .fold(
        { error =>
          errorDetailedMessage(s"create failed due to $error")
          val errResult = error match {
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
          Future.successful(errResult)
        },
        { statusResponse =>
          logDetailedMessage("create succeeded")
          cookies(product, userEmail)
            .map(cookies => Accepted(statusResponse.asJson).withCookies(cookies: _*))
        },
      )
      .flatten
  }

  case class CheckoutCompleteCookieBody(
      userType: String,
      product: String,
  )
  object CheckoutCompleteCookieBody {
    implicit val encoder: Encoder[CheckoutCompleteCookieBody] =
      deriveEncoder[CheckoutCompleteCookieBody]
  }
  private def checkoutCompleteCookies(productType: ProductType, userEmail: String): Future[List[Cookie]] = {
    identityService
      .getUserType(userEmail)
      .fold(
        err => {
          SafeLogger.error(scrub"Failed to retrieve user type for $userEmail: $err")
          SafeLogger.error(scrub"Failed to create GU_CO_COMPLETE cookie")
          List.empty
        },
        response => {
          SafeLogger.info(s"Successfully retrieved user type for $userEmail")
          SafeLogger.info(s"USERTYPE: ${response.userType}")
          val cookieValue: String = CheckoutCompleteCookieBody(
            userType = response.userType,
            product = productType.toString,
          ).asJson.noSpaces

          List(
            Cookie(
              name = "GU_CO_COMPLETE",
              value = URLEncoder.encode(cookieValue, "UTF-8"),
              maxAge = Some(1209600), // fourteen days
              secure = true,
              httpOnly = false,
              domain = Some(guardianDomain.value),
            ),
          )
        },
      )
  }

  private def cookies(product: ProductType, userEmail: String): Future[List[Cookie]] = {
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
      case _: SupporterPlus =>
        List(
          "gu_digital_subscriber" -> true.toString,
          // "gu_supporter_plus" -> true.toString, // TODO: add this and remove the digisub one when the CMP cookie list has been updated
          "GU_AF1" -> DateTime.now().plusDays(1).getMillis.toString,
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
        domain = Some(guardianDomain.value),
      )
    }

    checkoutCompleteCookies(product, userEmail).map(_ ++ standardAndProductCookies)
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
