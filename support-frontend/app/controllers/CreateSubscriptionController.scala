package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, On, Switches}
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogging
import com.gu.support.catalog.NationalDelivery
import com.gu.support.paperround.PaperRoundServiceProvider
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers._
import config.Configuration.GuardianDomain
import config.RecaptchaConfigProvider
import controllers.CreateSubscriptionController._
import io.circe.Encoder
import io.circe.generic.semiauto._
import io.circe.syntax._
import lib.PlayImplicits._
import models.identity.responses.IdentityErrorResponse._
import org.apache.pekko.actor.{ActorSystem, Scheduler}
import org.joda.time.DateTime
import play.api.http.Writeable
import play.api.libs.circe.Circe
import play.api.mvc._
import services.AsyncAuthenticationService.IdentityIdAndEmail
import services.stepfunctions.{CreateSupportWorkersRequest, SupportWorkersClient}
import services.{
  IdentityService,
  RecaptchaResponse,
  RecaptchaService,
  TestUserService,
  UserBenefitsApiService,
  UserBenefitsApiServiceProvider,
  UserBenefitsResponse,
  UserDetails,
}
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber, PaperValidation}

import java.net.URLEncoder
import scala.concurrent.{ExecutionContext, Future}
import scala.util.chaining._

object CreateSubscriptionController {

  private sealed abstract class CreateSubscriptionError
  private case class ServerError(message: String) extends CreateSubscriptionError
  private case class RequestValidationError(message: String) extends CreateSubscriptionError

}

case class CreateSubscriptionResponse(
    status: Status,
    userType: String,
    trackingUri: String,
    failureReason: Option[CheckoutFailureReason] = None,
)

object CreateSubscriptionResponse {
  implicit val encoder: Encoder[CreateSubscriptionResponse] = deriveEncoder
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
    userBenefitsApiServiceProvider: UserBenefitsApiServiceProvider,
)(implicit val ec: ExecutionContext, system: ActorSystem)
    extends AbstractController(components)
    with Circe
    with SafeLogging {

  import actionRefiners._

  // This is just for readability
  private type CreateRequest = OptionalAuthRequest[CreateSupportWorkersRequest]

  private val createRequestBodyParser: BodyParser[CreateSupportWorkersRequest] = {
    val maxCreateJsonLength: Long = 200 * 1024
    circe.json(maxCreateJsonLength).validate { json =>
      val decoderResult = json.as[CreateSupportWorkersRequest]
      decoderResult.leftMap(error => Results.BadRequest(error.show))
    }
  }

  def create: EssentialAction =
    LoggingAndAlarmOnFailure {
      MaybeAuthenticatedActionOnFormSubmission.async(createRequestBodyParser) { implicit request =>
        implicit val settings: AllSettings = settingsProvider.getAllSettings()

        logDetailedMessage("attempting to create")
        val json = request.body.copy(debugInfo = None).asJson
        logDetailedMessage(json.toString)

        // Only Direct Debit requests include a recaptchaToken.
        // For Stripe payments, recaptcha validation is done earlier in the flow
        val recaptchaToken =
          request.body.paymentFields match {
            case dd: DirectDebitPaymentFields => Some(dd.recaptchaToken)
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
      settings.switches.recaptchaSwitches.enableRecaptchaBackend.contains(On)
    val recaptchaFrontendEnabled =
      settings.switches.recaptchaSwitches.enableRecaptchaFrontend.contains(On)
    // We never validate on backend unless frontend validation is Enabled
    val recaptchaEnabled = recaptchaFrontendEnabled && recaptchaBackendEnabled

    val v2RecaptchaSecretKey = recaptchaConfigProvider.get(isTestUser).v2SecretKey

    if (recaptchaEnabled) {
      logDetailedMessage("validating recaptcha")
      recaptchaService
        .verify(token, v2RecaptchaSecretKey)
        .leftMap(err => RequestValidationError(err))
        .subflatMap {
          case RecaptchaResponse(true, _) => Right(())

          case RecaptchaResponse(false, errorCodes) =>
            logErrorDetailedMessage(s"recaptcha failed with error codes: ${errorCodes.getOrElse(Nil).mkString(", ")}")
            Left(RequestValidationError(RecaptchaResponse.recaptchaFailedCode))
        }
    } else {
      EitherT.rightT(())
    }
  }

  private def validateBenefitsForAdLitePurchase(
      response: UserBenefitsResponse,
      userSignedIn: Boolean,
  ): EitherT[Future, CreateSubscriptionError, Unit] = {
    if (response.benefits.contains("adFree") || response.benefits.contains("allowRejectAll")) {
      val errorCode =
        if (userSignedIn) "guardian_ad_lite_purchase_not_allowed_signed_in" else "guardian_ad_lite_purchase_not_allowed"
      EitherT.leftT(RequestValidationError(errorCode))
    } else {
      // Eligible
      EitherT.rightT(())
    }
  }

  private def validateUserIsEligibleForPurchase(
      request: Request[CreateSupportWorkersRequest],
      userDetails: UserDetailsWithSignedInStatus,
  ): EitherT[Future, CreateSubscriptionError, Unit] = {
    request.body.product match {
      case GuardianAdLite(_) => {
        for {
          benefits <- userBenefitsApiServiceProvider
            .forUser(testUsers.isTestUser(request))
            .getUserBenefits(userDetails.userDetails.identityId)
            .leftMap(_ => ServerError("Something went wrong calling the user benefits API"))
          _ <- validateBenefitsForAdLitePurchase(benefits, userDetails.isSignedIn)
        } yield ()
      }
      case _ => EitherT.rightT(())
    }
  }

  case class UserDetailsWithSignedInStatus(
      userDetails: UserDetails,
      isSignedIn: Boolean,
  )

  private def createSubscription(implicit
      settings: AllSettings,
      request: CreateRequest,
  ): EitherT[Future, CreateSubscriptionError, CreateSubscriptionResponse] = {

    val maybeLoggedInUserDetails =
      request.user.map(authIdUser =>
        UserDetailsWithSignedInStatus(
          UserDetails(authIdUser.id, authIdUser.primaryEmailAddress, "current"),
          isSignedIn = true,
        ),
      )

    logDetailedMessage("createSubscription")

    for {
      _ <- validate(request, settings.switches)
      userDetails <- maybeLoggedInUserDetails match {
        case Some(userDetails) => EitherT.pure[Future, CreateSubscriptionError](userDetails)
        case None =>
          getOrCreateIdentityUser(request.body, request.headers.get("Referer"))
            .map(userDetails => UserDetailsWithSignedInStatus(userDetails, isSignedIn = false))
            .leftMap(mapIdentityErrorToCreateSubscriptionError)
      }

      _ <- validateUserIsEligibleForPurchase(request, userDetails)

      supportWorkersUser = buildSupportWorkersUser(userDetails.userDetails, request.body, testUsers.isTestUser(request))

      statusResponse <- client
        .createSubscription(
          request = request.body,
          user = supportWorkersUser,
          requestId = request.uuid,
          ipAddress = request.headers.get("user-agent").getOrElse("Unknown"),
          userAgent =
            request.headers.get("X-Forwarded-For").flatMap(_.split(',').headOption).getOrElse(request.remoteAddress),
        )
        .leftMap[CreateSubscriptionError](ServerError)

    } yield CreateSubscriptionResponse(
      statusResponse.status,
      userDetails.userDetails.userType,
      statusResponse.trackingUri,
      statusResponse.failureReason,
    )
  }

  private def mapIdentityErrorToCreateSubscriptionError(identityError: IdentityError): CreateSubscriptionError =
    identityError match {
      case EmailProviderRejected(_) => RequestValidationError(emailProviderRejectedCode)
      case InvalidEmailAddress(_) => RequestValidationError(invalidEmailAddressCode)
      // We're mapping this to a ServerError because it shouldn't ever happen, but sometimes does. Even though we
      // asked identity (in getOrCreateIdentityUser) whether the user exists first, sometimes we get an answer of no
      // back but then attempting to create returns this error.
      case EmailAddressAlreadyTaken(_) => ServerError(emailAddressAlreadyTakenCode)
      case OtherIdentityError(message, description, endpoint) =>
        endpoint match {
          case Some(GuestEndpoint) => ServerError(s"Identity error calling /guest: $message; $description")
          case Some(UserEndpoint) => ServerError(s"Identity error calling /user: $message; $description")
          case None => ServerError(s"Error calling Identity: $message: $description")
        }
    }

  private def logErrorDetailedMessage(message: String)(implicit request: CreateRequest): Unit = {
    val maybeLoggedInIdentityIdAndEmail =
      request.user.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))

    val userDesc = maybeLoggedInIdentityIdAndEmail match {
      case None => (request.body.email, "guest")
      case Some(idAndEmail) => (idAndEmail.primaryEmailAddress, "logged-in")
    }
    logger.error(
      scrub"[CreateSubscriptionController] [${request.uuid}] [${userDesc._1}] [${userDesc._2}] [${request.body.product.describe}] $message",
    )
  }

  private def logDetailedMessage(message: String)(implicit request: CreateRequest): Unit = {
    val maybeLoggedInIdentityIdAndEmail =
      request.user.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))

    val (user, desc) = maybeLoggedInIdentityIdAndEmail match {
      case None => (request.body.email, "guest")
      case Some(idAndEmail) => (idAndEmail.primaryEmailAddress, "logged-in")
    }
    logger.info(
      s"[CreateSubscriptionController] [${request.uuid}] [$user] [$desc] [${request.body.product.describe}] $message",
    )
  }

  private def getOrCreateIdentityUser(
      body: CreateSupportWorkersRequest,
      referer: Option[String],
  ): EitherT[Future, IdentityError, UserDetails] = {
    implicit val scheduler: Scheduler = system.scheduler
    identityService.getOrCreateUserFromEmail(
      body.email,
      body.firstName,
      body.lastName,
      body.ophanIds.pageviewId,
      referer,
    )
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

  // When the user completes the checkout, remove the incomplete checkout cookie
  private val discardIncompleteCheckoutCookie =
    DiscardingCookie(name = "GU_CO_INCOMPLETE", domain = Some(guardianDomain.value))

  private def toHttpResponse(
      result: EitherT[Future, CreateSubscriptionError, CreateSubscriptionResponse],
      product: ProductType,
      userEmail: String,
  )(implicit request: CreateRequest, writeable: Writeable[String]): Future[Result] = {
    result.value.flatMap {
      case Left(error) =>
        logErrorDetailedMessage(s"create failed due to $error")
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
          case ServerError(code) if code == emailAddressAlreadyTakenCode =>
            Result(
              header = new ResponseHeader(
                status = INTERNAL_SERVER_ERROR,
                reasonPhrase = Some(emailAddressAlreadyTakenCode),
              ),
              body = writeable.toEntity(""),
            )
          case _: ServerError =>
            InternalServerError
        }
        Future.successful(errResult)
      case Right(createSubscriptionResponse) =>
        logDetailedMessage("create succeeded")
        cookies(product, userEmail).map { cookies =>
          Accepted(createSubscriptionResponse.asJson)
            .withCookies(cookies: _*)
            .discardingCookies(discardIncompleteCheckoutCookie)
        }
    }
  }

  case class CheckoutCompleteCookieBody(
      userType: String,
      product: String,
  )
  private object CheckoutCompleteCookieBody {
    implicit val encoder: Encoder[CheckoutCompleteCookieBody] =
      deriveEncoder[CheckoutCompleteCookieBody]
  }
  private def checkoutCompleteCookies(productType: ProductType, userEmail: String): Future[List[Cookie]] = {
    identityService
      .getUserType(userEmail)
      .fold(
        err => {
          logger.error(scrub"Failed to retrieve user type for $userEmail: $err")
          logger.error(scrub"Failed to create GU_CO_COMPLETE cookie")
          List.empty
        },
        response => {
          logger.info(s"Successfully retrieved user type for $userEmail")
          logger.info(s"USERTYPE: ${response.userType}")
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
    val productCookiesCreator = SubscriptionProductCookiesCreator(guardianDomain)
    val productCookies = productCookiesCreator.createCookiesForProduct(product, DateTime.now())
    checkoutCompleteCookies(product, userEmail).map(_ ++ productCookies)
  }

  private def buildSupportWorkersUser(
      userDetails: UserDetails,
      request: CreateSupportWorkersRequest,
      isTestUser: Boolean,
  ) = {
    User(
      id = userDetails.identityId,
      primaryEmailAddress = userDetails.email,
      title = request.title,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = request.billingAddress,
      deliveryAddress = request.deliveryAddress,
      telephoneNumber = for {
        phoneNo <- request.telephoneNumber
        updatedNo <- NormalisedTelephoneNumber
          .formatFromStringAndCountry(phoneNo, request.billingAddress.country)
          .tap(_.left.foreach(logger.warn))
          .toOption
      } yield updatedNo,
      isTestUser = isTestUser,
      deliveryInstructions = request.deliveryInstructions,
    )
  }
}
