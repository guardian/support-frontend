package backend

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.stripe.model.{Charge, Event, ExternalAccount}
import model.email.ContributorRow
import model.paypal.PaypalApiError
import model.stripe.{StripeApiError, _}
import model.{AcquisitionData, _}
import org.mockito.Matchers._
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{Matchers, WordSpec}
import services._
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}


class StripeBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  //-- entities
  val acquisitionData = AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None, None)
  val stripePaymentData = StripePaymentData("email@email.com", Currency.USD, 12, "token", None)
  val stripeChargeData = StripeChargeData(stripePaymentData, acquisitionData, None)
  val countrySubdivisionCode = Some("NY")
  val clientBrowserInfo =  ClientBrowserInfo("","",None,"",countrySubdivisionCode)
  val stripeHookObject = StripeHookObject("id", "GBP")
  val stripeHookData = StripeHookData(stripeHookObject)
  val stripeHook = StripeRefundHook("id", PaymentStatus.Paid, stripeHookData)
  val ophanError: List[AnalyticsServiceError] = List(AnalyticsServiceError.BuildError("Ophan error response"))
  val dbError = DatabaseService.Error("DB error response", None)

  val identityError = IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("test@theguardian.com")
  )

  val paymentError = PaypalApiError.fromString("Error response")
  val stripeApiError = StripeApiError.fromThrowable(new Exception("Stripe error"))
  val backendError = BackendError.fromStripeApiError(stripeApiError)
  val emailError: EmailService.Error = EmailService.Error(new Exception("Email error response"))


  //-- mocks
  val chargeMock: Charge = mock[Charge]
  val eventMock = mock[Event]

  //-- service responses
  val paymentServiceResponse: EitherT[Future, StripeApiError, Charge] =
    EitherT.right(Future.successful(chargeMock))
  val paymentServiceResponseError: EitherT[Future, StripeApiError, Charge] =
    EitherT.left(Future.successful(stripeApiError))
  val acquisitionResponse: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.right(Future.successful(mock[AcquisitionSubmission]))
  val acquisitionResponseError: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.left(Future.successful(identityError))
  val validateRefundHookSuccess: EitherT[Future, StripeApiError, Unit] =
    EitherT.right(Future.successful(()))
  val validateRefundHookFailure: EitherT[Future, StripeApiError, Unit] =
    EitherT.left(Future.successful(stripeApiError))
  val databaseResponseError: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val databaseResponse: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(emailError))

  //-- service mocks
  val mockStripeService: StripeService = mock[StripeService]
  val mockDatabaseService: DatabaseService = mock[DatabaseService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockOphanService: AnalyticsService = mock[AnalyticsService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  //-- test obj
  val stripeBackend = new StripeBackend(
    mockStripeService,
    mockDatabaseService,
    mockIdentityService,
    mockOphanService,
    mockEmailService,
    mockCloudWatchService)(new DefaultThreadPool(ec))

  def populateChargeMock(): Unit = {
    val externalAccount = new ExternalAccount()
    when(chargeMock.getId).thenReturn("id")
    when(chargeMock.getReceiptEmail).thenReturn("email@email.com")
    when(chargeMock.getCreated).thenReturn(123123123132L)
    when(chargeMock.getCurrency).thenReturn("GBP")
    when(chargeMock.getAmount).thenReturn(12L)
    when(chargeMock.getSource).thenReturn(externalAccount)
    ()
  }
}


class StripeBackendSpec
  extends WordSpec
    with Matchers
    with FutureEitherValues
    with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val clientBrowserInfo =  ClientBrowserInfo("","",None,"",None)

  "Stripe Backend" when {

    "a request is made to create a charge/payment" should {

      "return error if stripe service fails" in new StripeBackendFixture {
        when(mockStripeService.createCharge(stripeChargeData)).thenReturn(paymentServiceResponseError)
        stripeBackend.createCharge(stripeChargeData, clientBrowserInfo).futureLeft shouldBe stripeApiError

      }

      "return successful payment response even if identityService, " +
        "ophanService, databaseService and emailService all fail" in new StripeBackendFixture {
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockStripeService.createCharge(stripeChargeData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
        stripeBackend.createCharge(stripeChargeData, clientBrowserInfo).futureRight shouldBe StripeChargeSuccess.fromCharge(chargeMock)
      }
    }

    "a request is made to process a refund hook" should {

      "return error if refund hook is not valid" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookFailure)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        stripeBackend.processRefundHook(stripeHook).futureLeft shouldBe backendError
      }

      "return error if databaseService fails" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookSuccess)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        stripeBackend.processRefundHook(stripeHook).futureLeft shouldBe BackendError.fromDatabaseError(dbError)
      }

      "return success if refund hook is valid and databaseService succeeds" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookSuccess)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponse)
        stripeBackend.processRefundHook(stripeHook).futureRight shouldBe(())
      }

    }


    "executing post-payment tasks" should {

      "return just an email send error if tracking succeeds but email send fails" in new StripeBackendFixture {
        populateChargeMock()

        // Tracking services all OK
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponse)

        // But email fails
        when(mockEmailService.sendThankYouEmail(ContributorRow("email@email.com", "USD", 1l, PaymentProvider.Stripe, None, BigDecimal(12)))).thenReturn(emailResponseError)

        val postPaymentTasks = PrivateMethod[EitherT[Future, BackendError,Unit]]('postPaymentTasks)
        val result = stripeBackend invokePrivate postPaymentTasks("email@email.com", stripeChargeData, chargeMock, clientBrowserInfo)

        result.futureLeft shouldBe BackendError.Email(emailError)
      }

      "return a combined error if tracking and email send fail" in new StripeBackendFixture {
        populateChargeMock()

        // Identity and Ophan are  OK
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)

        // But DB - and thus tracking - fails
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)

        // And email fails
        when(mockEmailService.sendThankYouEmail(ContributorRow("email@email.com", "USD", 1l, PaymentProvider.Stripe, None, BigDecimal(12)))).thenReturn(emailResponseError)

        val postPaymentTasks = PrivateMethod[EitherT[Future, BackendError,Unit]]('postPaymentTasks)
        val result = stripeBackend invokePrivate postPaymentTasks("email@email.com", stripeChargeData, chargeMock, clientBrowserInfo)
        val errors = BackendError.MultipleErrors(List(
          BackendError.Database(DatabaseService.Error("DB error response", None)),
          BackendError.Email(emailError)
        ))
        result.futureLeft shouldBe errors
      }
    }

    "tracking the contribution" should {

      "return just a DB error if Ophan succeeds but DB fails" in new StripeBackendFixture {
        populateChargeMock()

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        val trackContribution = PrivateMethod[EitherT[Future, BackendError,Unit]]('trackContribution)
        val result = stripeBackend invokePrivate trackContribution(chargeMock, stripeChargeData, None, clientBrowserInfo)
        result.futureLeft shouldBe BackendError.Database(DatabaseService.Error("DB error response", None))
      }

      "return a combined error if Ophan and DB fail" in new StripeBackendFixture {
        populateChargeMock()

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        val trackContribution = PrivateMethod[EitherT[Future, BackendError,Unit]]('trackContribution)
        val result = stripeBackend invokePrivate trackContribution(chargeMock, stripeChargeData, None, clientBrowserInfo)
        val error = BackendError.MultipleErrors(List(
          BackendError.Database(DatabaseService.Error("DB error response", None)),
          BackendError.fromOphanError(List(AnalyticsServiceError.BuildError("Ophan error response"))))
        )
        result.futureLeft shouldBe error
      }
    }
  }
}
