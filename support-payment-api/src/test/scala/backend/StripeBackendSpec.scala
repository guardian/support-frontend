package backend

import org.apache.pekko.actor.ActorSystem
import backend.BackendError.SoftOptInsServiceError
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.stripe.model.Charge.PaymentMethodDetails
import com.stripe.model.{Charge, ChargeCollection, Event, PaymentIntent}
import io.circe.Json
import model.Environment.Live
import model.UserType.Current
import model._
import model.paypal.PaypalApiError
import model.stripe.StripePaymentIntentRequest.{ConfirmPaymentIntent, CreatePaymentIntent}
import model.stripe.StripePaymentMethod.{StripeApplePay, StripeCheckout, StripePaymentRequestButton}
import model.stripe._
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import play.api.libs.ws.WSClient
import services.SwitchState.{Off, On}
import services._
import software.amazon.awssdk.services.s3.S3Client
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}

class StripeBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  // -- entities
  val email = Json.fromString("email@email.com").as[NonEmptyString].toOption.get
  val token = Json.fromString("token").as[NonEmptyString].toOption.get
  val recaptchaToken = "recaptchaToken"
  val acquisitionData =
    AcquisitionData(
      Some("platform"),
      None,
      None,
      None,
      None,
      None,
      None,
      None,
      None,
      None,
      None,
      None,
      None,
      Some("N1 9GU"),
    )
  val stripePaymentData = StripePaymentData(email, Currency.USD, 12, Some(StripeCheckout))
  val stripePublicKey = StripePublicKey("pk_test_FOOBAR")
  val createPaymentIntent =
    CreatePaymentIntent(
      "payment-method-id",
      stripePaymentData,
      acquisitionData,
      stripePublicKey,
      recaptchaToken,
      similarProductsConsent = Some(false),
    )
  val confirmPaymentIntent =
    ConfirmPaymentIntent(
      "id",
      stripePaymentData,
      acquisitionData,
      stripePublicKey,
      similarProductsConsent = Some(false),
    )

  val countrySubdivisionCode = Some("NY")
  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, countrySubdivisionCode)
  val stripeHookObject = StripeHookObject("id", "GBP")
  val stripeHookData = StripeHookData(stripeHookObject)
  val stripeHook = StripeRefundHook("id", PaymentStatus.Paid, stripeHookData)
  val dbError = ContributionsStoreService.Error(new Exception("DB error response"))

  val identityError = IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("test@theguardian.com"),
  )
  val stripeDisabledErrorText = "Stripe payments are currently disabled"
  val paymentError = PaypalApiError.fromString("Error response")
  val stripeApiError = StripeApiError.fromThrowable(new Exception("Stripe error"), None)
  val backendError = BackendError.fromStripeApiError(stripeApiError)
  val emailError: EmailService.Error = EmailService.Error(new Exception("Email error response"))

  // -- mocks
  val chargeMock: Charge = mock[Charge]
  val eventMock = mock[Event]
  val paymentIntentMock = mock[PaymentIntent]

  // -- service responses
  val paymentServiceResponse: EitherT[Future, StripeApiError, Charge] =
    EitherT.right(Future.successful(chargeMock))
  val paymentServiceIntentResponse: EitherT[Future, StripeApiError, PaymentIntent] =
    EitherT.right(Future.successful(paymentIntentMock))
  val paymentServiceIntentErrorResponse: EitherT[Future, StripeApiError, PaymentIntent] =
    EitherT.left(Future.successful(stripeApiError))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, IdentityUserDetails] =
    EitherT.right(Future.successful(IdentityUserDetails("1", Current)))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, IdentityUserDetails] =
    EitherT.left(Future.successful(identityError))
  val validateRefundHookSuccess: EitherT[Future, StripeApiError, Unit] =
    EitherT.right(Future.successful(()))
  val validateRefundHookFailure: EitherT[Future, StripeApiError, Unit] =
    EitherT.left(Future.successful(stripeApiError))
  val databaseResponseError: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val databaseResponse: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val supporterProductDataResponseError: EitherT[Future, String, Unit] =
    EitherT.left(Future.successful("an error from supporter product data"))
  val supporterProductDataResponse: EitherT[Future, String, Unit] =
    EitherT.right(Future.successful(()))
  val softOptInsResponseError: EitherT[Future, SoftOptInsServiceError, Unit] =
    EitherT.left(Future.successful(SoftOptInsServiceError("an error from soft opt-ins")))
  val softOptInsResponse: EitherT[Future, SoftOptInsServiceError, Unit] =
    EitherT.right(Future.successful(()))
  val acquisitionsEventBusResponse: Future[Either[String, Unit]] =
    Future.successful(Right(()))
  val acquisitionsEventBusErrorMessage = "an event bus error"
  val acquisitionsEventBusResponseError: Future[Either[String, Unit]] =
    Future.successful(Left(acquisitionsEventBusErrorMessage))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(emailError))
  val emailServiceErrorResponse: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(EmailService.Error(new Exception("email service failure"))))
  val recaptchaServiceErrorResponse: EitherT[Future, StripeApiError, RecaptchaResponse] =
    EitherT.left(Future.successful(stripeApiError))
  val recaptchaServiceSuccess: EitherT[Future, StripeApiError, RecaptchaResponse] =
    EitherT.right(Future.successful(RecaptchaResponse(true)))
  val recaptchaServiceFail: EitherT[Future, StripeApiError, RecaptchaResponse] =
    EitherT.right(Future.successful(RecaptchaResponse(false)))
  val switchServiceOnResponse: EitherT[Future, Nothing, Switches] =
    EitherT.right(
      Future.successful(
        Switches(
          Some(RecaptchaSwitches(RecaptchaSwitchTypes(Some(SwitchDetails(On)), Some(SwitchDetails(On))))),
          Some(
            OneOffPaymentMethodsSwitches(
              OneOffPaymentMethodsSwitchesTypes(
                Some(SwitchDetails(On)),
                Some(SwitchDetails(On)),
                Some(SwitchDetails(On)),
              ),
            ),
          ),
          Some(FeatureSwitches(FeatureSwitchesTypes(Some(SwitchDetails(On))))),
        ),
      ),
    )
  val switchServiceStripeOffResponse: EitherT[Future, Nothing, Switches] =
    EitherT.right(
      Future.successful(
        Switches(
          Some(RecaptchaSwitches(RecaptchaSwitchTypes(Some(SwitchDetails(On)), Some(SwitchDetails(On))))),
          Some(
            OneOffPaymentMethodsSwitches(
              OneOffPaymentMethodsSwitchesTypes(
                Some(SwitchDetails(Off)),
                Some(SwitchDetails(Off)),
                Some(SwitchDetails(On)),
              ),
            ),
          ),
          Some(FeatureSwitches(FeatureSwitchesTypes(Some(SwitchDetails(On))))),
        ),
      ),
    )

  // -- service mocks
  val mockStripeService: StripeService = mock[StripeService]
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockAcquisitionsEventBusService: AcquisitionsEventBusService = mock[AcquisitionsEventBusService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockRecaptchaService: RecaptchaService = mock[RecaptchaService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]
  val mockSupporterProductDataService: SupporterProductDataService = mock[SupporterProductDataService]
  val mockSwitchService: SwitchService = mock[SwitchService]
  implicit val mockWsClient: WSClient = mock[WSClient]
  implicit val mockActorSystem: ActorSystem = mock[ActorSystem]
  implicit val mockS3Client: S3Client = mock[S3Client]

  // happens on instantiation of StripeBackend
  when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)

  // -- test obj
  val stripeBackend = new StripeBackend(
    mockStripeService,
    mockDatabaseService,
    mockIdentityService,
    mockAcquisitionsEventBusService,
    mockEmailService,
    mockRecaptchaService,
    mockCloudWatchService,
    mockSupporterProductDataService,
    mockSwitchService,
    Live,
  )(DefaultThreadPool(ec), mockWsClient)

  def populateChargeMock(): Unit = {
    when(chargeMock.getId).thenReturn("id")
    when(chargeMock.getReceiptEmail).thenReturn("email@email.com")
    when(chargeMock.getCreated).thenReturn(123123123132L)
    when(chargeMock.getCurrency).thenReturn("GBP")
    when(chargeMock.getAmount).thenReturn(12L)

    val paymentMethodDetailsMock = mock[PaymentMethodDetails]
    val cardMock = mock[PaymentMethodDetails.Card]
    when(cardMock.getCountry).thenReturn("GB")
    when(paymentMethodDetailsMock.getCard).thenReturn(cardMock)
    when(chargeMock.getPaymentMethodDetails).thenReturn(paymentMethodDetailsMock)
    ()
  }

  def populatePaymentIntentMock(): Unit = {
    when(paymentIntentMock.getId).thenReturn("id")
    when(paymentIntentMock.getReceiptEmail).thenReturn("email@email.com")
    when(paymentIntentMock.getCreated).thenReturn(123123123132L)
    when(paymentIntentMock.getCurrency).thenReturn("GBP")
    when(paymentIntentMock.getAmount).thenReturn(12L)

    import scala.jdk.CollectionConverters._
    val chargeCollection = mock[ChargeCollection]
    when(chargeCollection.getData).thenReturn(List(chargeMock).asJava)
    when(paymentIntentMock.getCharges).thenReturn(chargeCollection)
  }
}

class StripeBackendSpec
    extends AnyWordSpec
    with Matchers
    with FutureEitherValues
    with IntegrationPatience
    with WSClientProvider {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, None)

  "Stripe Backend" when {

    "a request is made to create a Payment Intent" should {
      "return Stripe payments are currently disabled response  if stripe checkout switch is off in support-admin-console" in new StripeBackendFixture {
        val stripePaymentDataWithStripe = StripePaymentData(email, Currency.USD, 12, Some(StripeCheckout))
        val createPaymentIntentWithStripeCheckout =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithStripe,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceStripeOffResponse)

        stripeBackend.createPaymentIntent(createPaymentIntentWithStripeCheckout, clientBrowserInfo).futureLeft mustBe
          StripeApiError.fromString(stripeDisabledErrorText, None)
      }

      "return Stripe payments are currently disabled response  if stripe Apple Pay switch is off in support-admin-console" in new StripeBackendFixture {
        val stripePaymentDataWithApplePay = StripePaymentData(email, Currency.USD, 12, Some(StripeApplePay))
        val createPaymentIntentWithStripeApplePay =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithApplePay,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceStripeOffResponse)

        stripeBackend.createPaymentIntent(createPaymentIntentWithStripeApplePay, clientBrowserInfo).futureLeft mustBe
          StripeApiError.fromString(stripeDisabledErrorText, None)
      }
      "return Stripe payments are currently disabled response  if stripe payment request button switch is off in support-admin-console" in new StripeBackendFixture {
        val stripePaymentDataWithStripePaymentRequest =
          StripePaymentData(email, Currency.USD, 12, Some(StripePaymentRequestButton))
        val createPaymentIntentWithStripePaymentRequest =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithStripePaymentRequest,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceStripeOffResponse)

        stripeBackend
          .createPaymentIntent(createPaymentIntentWithStripePaymentRequest, clientBrowserInfo)
          .futureLeft mustBe
          StripeApiError.fromString(stripeDisabledErrorText, None)
      }
      "return Success if stripe checkout switch is On in support-admin-console" in new StripeBackendFixture {
        val stripePaymentDataWithStripe = StripePaymentData(email, Currency.USD, 12, Some(StripeCheckout))
        val createPaymentIntentWithStripeCheckout =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithStripe,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponseError)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any())).thenReturn(acquisitionsEventBusResponse)
        when(mockStripeService.createPaymentIntent(createPaymentIntentWithStripeCheckout))
          .thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceSuccess)
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)

        stripeBackend.createPaymentIntent(createPaymentIntentWithStripeCheckout, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.Success(Some(Current))

      }

      "return Success if stripe apple pay switch is On in support-admin-console" in new StripeBackendFixture {
        val stripePaymentDataWithStripeApplePay = StripePaymentData(email, Currency.USD, 12, Some(StripeApplePay))
        val createPaymentIntentWithStripeApplePay =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithStripeApplePay,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponseError)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponse)
        when(mockStripeService.createPaymentIntent(createPaymentIntentWithStripeApplePay))
          .thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceSuccess)
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)

        stripeBackend.createPaymentIntent(createPaymentIntentWithStripeApplePay, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.Success(Some(Current))
      }
      "return Success if stripe payment request button  switch is On in support-admin-console" in new StripeBackendFixture {
        val stripePaymentDataWithStripePaymentRequest =
          StripePaymentData(email, Currency.USD, 12, Some(StripePaymentRequestButton))
        val createPaymentIntentWithStripePaymentRequest =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithStripePaymentRequest,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponseError)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponse)
        when(mockStripeService.createPaymentIntent(createPaymentIntentWithStripePaymentRequest))
          .thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceSuccess)
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)

        stripeBackend
          .createPaymentIntent(createPaymentIntentWithStripePaymentRequest, clientBrowserInfo)
          .futureRight mustBe
          StripePaymentIntentsApiResponse.Success(Some(Current))
      }
    }

    "a request is made to create a charge/payment" should {

      "return error if the email address is invalid due to a comma in it" in new StripeBackendFixture {
        val emailWithComma = Json.fromString("email,address@email.com").as[NonEmptyString].toOption.get
        val stripePaymentDataWithStripe = StripePaymentData(emailWithComma, Currency.USD, 12, Some(StripeCheckout))
        val createPaymentIntentWithStripeCheckout =
          CreatePaymentIntent(
            "payment-method-id",
            stripePaymentDataWithStripe,
            acquisitionData,
            stripePublicKey,
            recaptchaToken,
            similarProductsConsent = Some(false),
          )
        populateChargeMock()
        stripeBackend.createPaymentIntent(createPaymentIntentWithStripeCheckout, clientBrowserInfo).futureLeft mustBe
          StripeApiError.fromString("Invalid email address", None)
      }

    }

    "a request is made to process a refund hook" should {

      "return error if refund hook is not valid" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookFailure)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        stripeBackend.processRefundHook(stripeHook).futureLeft mustBe backendError
      }

      "return error if databaseService fails" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookSuccess)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        stripeBackend.processRefundHook(stripeHook).futureLeft mustBe BackendError.fromDatabaseError(dbError)
      }

      "return success if refund hook is valid and databaseService succeeds" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookSuccess)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponse)
        stripeBackend.processRefundHook(stripeHook).futureRight mustBe ()
      }

    }

    "tracking the contribution" should {

      "return just a DB error if BigQuery succeeds but DB fails" in new StripeBackendFixture {
        populateChargeMock()

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponse)
        val trackContribution = PrivateMethod[Future[List[BackendError]]](Symbol("trackContribution"))
        val result =
          stripeBackend invokePrivate trackContribution(chargeMock, createPaymentIntent, None, clientBrowserInfo)
        result.futureValue mustBe List(BackendError.Database(dbError))

      }

      "return a combined error if BigQuery and DB fail" in new StripeBackendFixture {
        populateChargeMock()

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponseError)
        val trackContribution = PrivateMethod[Future[List[BackendError]]](Symbol("trackContribution"))
        val result =
          stripeBackend invokePrivate trackContribution(chargeMock, createPaymentIntent, None, clientBrowserInfo)
        val error = List(
          BackendError.AcquisitionsEventBusError(acquisitionsEventBusErrorMessage),
          BackendError.Database(dbError),
        )
        result.futureValue mustBe error

      }
    }

    "a request is made to create a Payment Intent" should {
      "return Success if no 3DS required" in new StripeBackendFixture {
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponse)
        when(mockStripeService.createPaymentIntent(createPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceSuccess)

        stripeBackend.createPaymentIntent(createPaymentIntent, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.Success(Some(Current))

      }

      "return RequiresAction if 3DS required" in new StripeBackendFixture {
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("requires_action")
        when(paymentIntentMock.getClientSecret).thenReturn("a_secret")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockStripeService.createPaymentIntent(createPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceSuccess)

        stripeBackend.createPaymentIntent(createPaymentIntent, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.RequiresAction("a_secret")
      }
    }

    "a request is made to create a Payment Intent with a recaptcha token" should {

      "return fail if recaptcha check fails" in new StripeBackendFixture {
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockStripeService.createPaymentIntent(createPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceFail)

        stripeBackend.createPaymentIntent(createPaymentIntent, clientBrowserInfo).futureLeft mustBe
          StripeApiError.fromString(s"Recaptcha failed", None)
      }

      "error if recaptcha is unavailable" in new StripeBackendFixture {
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)
        when(mockStripeService.createPaymentIntent(createPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceErrorResponse)

        stripeBackend.createPaymentIntent(createPaymentIntent, clientBrowserInfo).futureLeft mustBe
          StripeApiError.fromString(s"Stripe error", None)

      }
    }

    "a request is made to confirm a Payment Intent" should {
      "return Success if confirmation succeeded" in new StripeBackendFixture {
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("succeeded")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponse)
        when(mockStripeService.confirmPaymentIntent(confirmPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)

        stripeBackend.confirmPaymentIntent(confirmPaymentIntent, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.Success(Some(Current))

      }

      "return an error if confirmation failed" in new StripeBackendFixture {
        populateChargeMock()
        when(paymentIntentMock.getStatus).thenReturn("canceled")

        populatePaymentIntentMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockStripeService.confirmPaymentIntent(confirmPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)

        stripeBackend.confirmPaymentIntent(confirmPaymentIntent, clientBrowserInfo).futureLeft mustBe
          StripeApiError.fromString(s"Unexpected status on Stripe Payment Intent: canceled", None)

      }
    }
  }
}
