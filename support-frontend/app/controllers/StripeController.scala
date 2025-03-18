package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettingsProvider, On}
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudWatchClient}
import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.config.Stage
import com.gu.support.workers.{
  Address,
  Monthly,
  PaymentMethodId,
  StripePaymentFields,
  StripePaymentType,
  SupporterPlus,
  User,
}
import com.typesafe.scalalogging.StrictLogging
import config.RecaptchaConfigProvider
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import lib.PlayImplicits.RichRequest
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}
import services.stepfunctions.{CreateSupportWorkersRequest, SupportWorkersClient}
import services.{
  RecaptchaService,
  RetrieveCheckoutSessionResponseSuccess,
  StripeCheckoutSessionService,
  StripeSetupIntentService,
  UserDetails,
}
import utils.NormalisedTelephoneNumber

import scala.concurrent.{ExecutionContext, Future}
import scala.util.chaining.scalaUtilChainingOps

case class SetupIntentRequestRecaptcha(token: String, stripePublicKey: String, isTestUser: Boolean)
object SetupIntentRequestRecaptcha {
  implicit val decoder: Decoder[SetupIntentRequestRecaptcha] = deriveDecoder
}

case class SetupIntentRequest(stripePublicKey: String)
object SetupIntentRequest {
  implicit val decoder: Decoder[SetupIntentRequest] = deriveDecoder
}

case class CreateCheckoutSessionRequest()
object CreateCheckoutSessionRequest {
  implicit val decoder: Decoder[CreateCheckoutSessionRequest] = deriveDecoder
}

case class CompleteCheckoutSessionRequest()
object CompleteCheckoutSessionRequest {
  implicit val decoder: Decoder[CompleteCheckoutSessionRequest] = deriveDecoder
}

case class CreateCheckoutSessionResponse(url: String, id: String)
object CreateCheckoutSessionResponse {
  implicit val encoder: Encoder[CreateCheckoutSessionResponse] = deriveEncoder
}

case class CompleteCheckoutSessionResponse()
object CompleteCheckoutSessionResponse {
  implicit val encoder: Encoder[CompleteCheckoutSessionResponse] = deriveEncoder
}

class StripeController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    recaptchaService: RecaptchaService,
    stripeService: StripeSetupIntentService,
    recaptchaConfigProvider: RecaptchaConfigProvider,
    settingsProvider: AllSettingsProvider,
    stripeCheckoutSessionService: StripeCheckoutSessionService,
    client: SupportWorkersClient,
    stage: Stage,
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with StrictLogging {

  import actionRefiners._
  import cats.data.EitherT
  import cats.implicits._
  import io.circe.syntax._

  def createSetupIntentRecaptcha: Action[SetupIntentRequestRecaptcha] =
    PrivateAction.async(circe.json[SetupIntentRequestRecaptcha]) { implicit request =>
      val recaptchaBackendEnabled =
        settingsProvider.getAllSettings().switches.recaptchaSwitches.enableRecaptchaBackend.contains(On)
      val recaptchaFrontendEnabled =
        settingsProvider.getAllSettings().switches.recaptchaSwitches.enableRecaptchaFrontend.contains(On)

      // We never validate on backend unless frontend validation is Enabled
      val recaptchaEnabled = recaptchaFrontendEnabled && recaptchaBackendEnabled

      val v2RecaptchaToken = request.body.token

      val v2RecaptchaSecretKey = recaptchaConfigProvider.get(isTestUser = request.body.isTestUser).v2SecretKey

      val cloudwatchEvent = AwsCloudWatchMetricSetup.createSetupIntentRequest(stage, "v2Recaptcha")
      AwsCloudWatchMetricPut(cloudWatchClient)(cloudwatchEvent)

      // Requests against the test account do not require verification
      val verified =
        if (recaptchaEnabled)
          recaptchaService.verify(v2RecaptchaToken, v2RecaptchaSecretKey).map(_.success)
        else
          EitherT.rightT[Future, String](true)

      val result = for {
        v <- verified
        response <-
          if (v) {
            stripeService(request.body.stripePublicKey).map(response => Ok(response.asJson))
          } else {
            logger.warn(
              s"Returning status Forbidden for Create Stripe Intent Recaptcha request because Recaptcha verification failed",
            )
            EitherT.rightT[Future, String](Forbidden(""))
          }
      } yield response

      result.fold(
        error => {
          logger.error(
            s"Returning status InternalServerError for Create Stripe Intent Recaptcha request because: $error",
          )
          InternalServerError("")
        },
        identity,
      )
    }

  def createSetupIntentPRB: Action[SetupIntentRequest] = PrivateAction.async(circe.json[SetupIntentRequest]) {
    implicit request =>
      val cloudwatchEvent = AwsCloudWatchMetricSetup.createSetupIntentRequest(stage, "PRB-CSRF-only")
      AwsCloudWatchMetricPut(cloudWatchClient)(cloudwatchEvent)

      stripeService(request.body.stripePublicKey).fold(
        error => {
          logger.error(s"Returning status InternalServerError for Create Stripe Intent PRB request because: $error")
          InternalServerError("")
        },
        response => Ok(response.asJson),
      )
  }

  def createCheckoutSession: Action[CreateCheckoutSessionRequest] =
    PrivateAction.async(circe.json[CreateCheckoutSessionRequest]) { implicit request =>
      stripeCheckoutSessionService
        .createCheckoutSession()
        .fold(
          error => {
            logger.error(s"Returning status InternalServerError for Create Checkout Session request because: $error")
            InternalServerError("")
          },
          stripeResponse => {
            val response = CreateCheckoutSessionResponse(stripeResponse.url, stripeResponse.id)
            Ok(response.asJson)
          },
        )
    }

  private def buildSupportWorkersRequest(
      session: RetrieveCheckoutSessionResponseSuccess,
  ): EitherT[Future, String, CreateSupportWorkersRequest] = {
    val maybePaymentMethod = PaymentMethodId(session.setup_intent.payment_method.id)

    maybePaymentMethod match {
      case Some(paymentMethod) =>
        val createSupportWorkersRequest = CreateSupportWorkersRequest(
          title = None,
          firstName = "Example",
          lastName = "Example",
          billingAddress = Address(
            lineOne = None,
            lineTwo = None,
            city = None,
            state = None,
            postCode = None,
            country = Country.UK,
          ),
          deliveryAddress = None,
          giftRecipient = None,
          product = SupporterPlus(
            amount = 12,
            currency = Currency.GBP,
            billingPeriod = Monthly,
          ),
          firstDeliveryDate = None,
          paymentFields = StripePaymentFields(
            paymentMethod = paymentMethod,
            stripePaymentType = Some(StripePaymentType.StripeCheckout),
            stripePublicKey = None,
          ),
          appliedPromotion = None,
          csrUsername = None,
          salesforceCaseId = None,
          ophanIds = OphanIds(None, None),
          referrerAcquisitionData =
            ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
          supportAbTests = Set.empty,
          email = "test@theguardian.com",
          telephoneNumber = None,
          deliveryInstructions = None,
          debugInfo = None,
        )
        EitherT.rightT[Future, String] {
          createSupportWorkersRequest
        }
      case _ =>
        EitherT.leftT[Future, CreateSupportWorkersRequest] { "Couldn't create support workers request" }
    }
  }

  def completeCheckoutSession(checkoutSessionId: String) =
    Action.async { implicit request =>
      val result = for {
        checkoutSession <- stripeCheckoutSessionService.retrieveCheckoutSession(checkoutSessionId)
        supportWorkersRequest <- buildSupportWorkersRequest(checkoutSession)
        userDetails = UserDetails("123456789", "test@guardian.co.uk", "guest")
        supportWorkersUser = buildSupportWorkersUser(userDetails, supportWorkersRequest, isTestUser = false)
        createSubscriptionResponse <- client
          .createSubscription(
            request = supportWorkersRequest,
            user = supportWorkersUser,
            requestId = request.uuid,
            ipAddress = request.headers.get("user-agent").getOrElse("Unknown"),
            userAgent =
              request.headers.get("X-Forwarded-For").flatMap(_.split(',').headOption).getOrElse(request.remoteAddress),
            host = "support.theguardian.com",
          )
      } yield createSubscriptionResponse

      result.fold(
        error => {
          logger.error(s"Returning status InternalServerError for Complete Checkout Session request because: $error")
          InternalServerError("")
            .withHeaders("Cache-Control" -> "private, no-store")
        },
        _ => {
          Ok("success")
            .withHeaders("Cache-Control" -> "private, no-store")
        },
      )
    }

  // This endpoint is deprecated
  def createSetupIntentWithAuth: Action[AnyContent] = Action.async { implicit request =>
    val cloudwatchEvent = AwsCloudWatchMetricSetup.createSetupIntentRequest(stage, "Deprecated-AuthorisedEndpoint");
    AwsCloudWatchMetricPut(cloudWatchClient)(cloudwatchEvent)
    Future.successful(Gone)
  }

  // Copied from CreateSubscriptionController
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
          .toOption
      } yield updatedNo,
      isTestUser = isTestUser,
      deliveryInstructions = request.deliveryInstructions,
    )
  }
}
