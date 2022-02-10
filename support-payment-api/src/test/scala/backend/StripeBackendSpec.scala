package backend

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.support.acquisitions.ga.{GoogleAnalyticsService, GoogleAnalyticsServiceMock}
import com.gu.support.acquisitions.{AcquisitionsStreamService, BigQueryService}
import com.stripe.model.Charge.PaymentMethodDetails
import com.stripe.model.{Charge, ChargeCollection, Event, PaymentIntent}
import io.circe.Json
import model.Environment.Live
import model.paypal.PaypalApiError
import model.stripe.StripePaymentIntentRequest.{ConfirmPaymentIntent, CreatePaymentIntent}
import model.stripe.{StripeApiError, _}
import model.{AcquisitionData, _}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import play.api.libs.ws.WSClient
import services.SwitchState.On
import services._
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}

class StripeBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  // -- entities
  val email = Json.fromString("email@email.com").as[NonEmptyString].right.get
  val token = Json.fromString("token").as[NonEmptyString].right.get
  val recaptchaToken = "recaptchaToken"
  val acquisitionData =
    AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None, None, None)
  val stripePaymentData = StripePaymentData(email, Currency.USD, 12, None)
  val legacyStripePaymentData = LegacyStripePaymentData(email, Currency.USD, 12, None, token)
  val stripePublicKey = StripePublicKey("pk_test_FOOBAR")
  val stripeChargeRequest = LegacyStripeChargeRequest(legacyStripePaymentData, acquisitionData, Some(stripePublicKey))
  val createPaymentIntent =
    CreatePaymentIntent("payment-method-id", stripePaymentData, acquisitionData, Some(stripePublicKey), recaptchaToken)
  val confirmPaymentIntent = ConfirmPaymentIntent("id", stripePaymentData, acquisitionData, Some(stripePublicKey))

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
  val paymentServiceResponseError: EitherT[Future, StripeApiError, Charge] =
    EitherT.left(Future.successful(stripeApiError))
  val paymentServiceIntentResponse: EitherT[Future, StripeApiError, PaymentIntent] =
    EitherT.right(Future.successful(paymentIntentMock))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.left(Future.successful(identityError))
  val validateRefundHookSuccess: EitherT[Future, StripeApiError, Unit] =
    EitherT.right(Future.successful(()))
  val validateRefundHookFailure: EitherT[Future, StripeApiError, Unit] =
    EitherT.left(Future.successful(stripeApiError))
  val databaseResponseError: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val databaseResponse: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val bigQueryResponse: EitherT[Future, List[String], Unit] =
    EitherT.right(Future.successful(()))
  val bigQueryErrorMessage = "a BigQuery error"
  val bigQueryResponseError: EitherT[Future, List[String], Unit] =
    EitherT.left(Future.successful(List(bigQueryErrorMessage)))
  val streamResponse: EitherT[Future, List[String], Unit] =
    EitherT.right(Future.successful(()))
  val streamResponseError: EitherT[Future, List[String], Unit] =
    EitherT.left(Future.successful(List("stream error")))
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
    EitherT.right(Future.successful(Switches(Some(On), Some(On))))

  // -- service mocks
  val mockStripeService: StripeService = mock[StripeService]
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockGaService: GoogleAnalyticsService = GoogleAnalyticsServiceMock
  val mockBigQueryService: BigQueryService = mock[BigQueryService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockRecaptchaService: RecaptchaService = mock[RecaptchaService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]
  val mockSwitchService: SwitchService = mock[SwitchService]
  val mockAcquisitionsStreamService: AcquisitionsStreamService = mock[AcquisitionsStreamService]
  implicit val mockWsClient: WSClient = mock[WSClient]
  implicit val mockActorSystem: ActorSystem = mock[ActorSystem]
  implicit val mockS3Client: AmazonS3 = mock[AmazonS3]

  // happens on instantiation of StripeBackend
  when(mockSwitchService.recaptchaSwitches).thenReturn(switchServiceOnResponse)

  // -- test obj
  val stripeBackend = new StripeBackend(
    mockStripeService,
    mockDatabaseService,
    mockIdentityService,
    mockGaService,
    mockBigQueryService,
    mockAcquisitionsStreamService,
    mockEmailService,
    mockRecaptchaService,
    mockCloudWatchService,
    mockSwitchService,
    Live,
  )(new DefaultThreadPool(ec), mockWsClient)

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

    "a request is made to create a charge/payment" should {

      "return error if stripe service fails" in new StripeBackendFixture {
        when(mockStripeService.createCharge(stripeChargeRequest)).thenReturn(paymentServiceResponseError)
        stripeBackend.createCharge(stripeChargeRequest, clientBrowserInfo).futureLeft mustBe stripeApiError
      }

      "return successful payment response even if identityService, " +
        "databaseService, bigQueryService and emailService all fail" in new StripeBackendFixture {
          populateChargeMock()
          when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
          when(mockStripeService.createCharge(stripeChargeRequest)).thenReturn(paymentServiceResponse)
          when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
          when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
          when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any()))
            .thenReturn(streamResponseError)
          stripeBackend
            .createCharge(stripeChargeRequest, clientBrowserInfo)
            .futureRight mustBe StripeCreateChargeResponse.fromCharge(
            chargeMock,
          )
        }

      "return successful payment response with guestAccountRegistrationToken if available" in new StripeBackendFixture {
        populateChargeMock()
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponse)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)
        when(mockStripeService.createCharge(stripeChargeRequest)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        stripeBackend.createCharge(stripeChargeRequest, clientBrowserInfo).futureRight mustBe StripeCreateChargeResponse
          .fromCharge(
            chargeMock,
          )
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
        stripeBackend.processRefundHook(stripeHook).futureRight mustBe (())
      }

    }

    "tracking the contribution" should {

      "return just a DB error if BigQuery succeeds but DB fails" in new StripeBackendFixture {
        populateChargeMock()

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponse)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)
        val trackContribution = PrivateMethod[Future[List[BackendError]]]('trackContribution)
        val result =
          stripeBackend invokePrivate trackContribution(chargeMock, stripeChargeRequest, None, clientBrowserInfo)
        result.futureValue mustBe List(BackendError.Database(dbError))
      }

      "return a combined error if BigQuery and DB fail" in new StripeBackendFixture {
        populateChargeMock()

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)
        val trackContribution = PrivateMethod[Future[List[BackendError]]]('trackContribution)
        val result =
          stripeBackend invokePrivate trackContribution(chargeMock, stripeChargeRequest, None, clientBrowserInfo)
        val error = List(
          BackendError.BigQueryError(bigQueryErrorMessage),
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
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponse)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)
        when(mockStripeService.createPaymentIntent(createPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)
        when(mockRecaptchaService.verify(recaptchaToken)).thenReturn(recaptchaServiceSuccess)

        stripeBackend.createPaymentIntent(createPaymentIntent, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.Success()
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
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponse)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)
        when(mockStripeService.confirmPaymentIntent(confirmPaymentIntent)).thenReturn(paymentServiceIntentResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailServiceErrorResponse)

        stripeBackend.confirmPaymentIntent(confirmPaymentIntent, clientBrowserInfo).futureRight mustBe
          StripePaymentIntentsApiResponse.Success()
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
