package backend

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.support.acquisitions.{AcquisitionsStreamService, BigQueryService}
import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment}
import model.paypal._
import model._
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import services._
import util.FutureEitherValues

import scala.jdk.CollectionConverters._
import scala.concurrent.{ExecutionContext, Future}

class PaypalBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  //-- entities
  val acquisitionData = AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None, None, None)
  val capturePaypalPaymentData = CapturePaypalPaymentData(CapturePaymentData("paymentId"), acquisitionData, Some("email@email.com"))
  val countrySubdivisionCode = Some("NY")
  val clientBrowserInfo =  ClientBrowserInfo("","",None,None,countrySubdivisionCode)
  val executePaypalPaymentData = ExecutePaypalPaymentData(
    ExecutePaymentData("paymentId", "payerId"), acquisitionData, "email@email.com"
  )
  val paypalRefundWebHookData = PaypalRefundWebHookData(
    body = PaypalRefundWebHookBody("parent_payment_id", "{}"),
    headers = Map.empty
  )
  val ophanError: List[AnalyticsServiceError] = List(AnalyticsServiceError.BuildError("Ophan error response"))
  val dbError = ContributionsStoreService.Error(new Exception("DB error response"))

  val identityError = IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("test@theguardian.com")
  )

  val paymentError = PaypalApiError.fromString("Error response")
  val backendPaymentError = BackendError.fromPaypalAPIError(paymentError)
  val backendDbError = BackendError.fromDatabaseError(dbError)
  val emailError: EmailService.Error = EmailService.Error(new Exception("Email error response"))


  //-- mocks
  val paymentMock: Payment = mock[Payment]
  val enrichedPaymentMock: EnrichedPaypalPayment = mock[EnrichedPaypalPayment]
  val amount = mock[Amount]
  val payer = mock[Payer]
  val payerInfo = mock[PayerInfo]
  val transaction = mock[com.paypal.api.payments.Transaction]
  val transactions = List(transaction).asJava

  //-- service responses
  val paymentServiceResponse: EitherT[Future, PaypalApiError, Payment] =
    EitherT.right(Future.successful(paymentMock))
  val enrichedPaymentServiceResponse: EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    EitherT.right(Future.successful(enrichedPaymentMock))
  val paymentServiceResponseError: EitherT[Future, PaypalApiError, Payment] =
    EitherT.left(Future.successful(paymentError))
  val unitPaymentResponse: EitherT[Future, PaypalApiError, Unit] =
    EitherT.right(Future.successful(()))
  val unitPaymentResponseError: EitherT[Future, PaypalApiError, Unit] =
    EitherT.left(Future.successful(paymentError))
  val acquisitionResponse: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.right(Future.successful(mock[AcquisitionSubmission]))
  val acquisitionResponseError: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))
  val databaseResponse: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val databaseResponseError: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val bigQueryResponse: EitherT[Future, List[String], Unit] =
    EitherT.right(Future.successful(()))
  val bigQueryErrorMessage = "a BigQuery error"
  val bigQueryResponseError: EitherT[Future, List[String], Unit] =
    EitherT.left(Future.successful(List(bigQueryErrorMessage)))
  val streamResponse: EitherT[Future, List[String], Unit] =
    EitherT.right(Future.successful(()))
  val streamResponseErrorMessage = "stream error"
  val streamResponseError: EitherT[Future, List[String], Unit] =
    EitherT.left(Future.successful(List(streamResponseErrorMessage)))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.left(Future.successful(identityError))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(emailError))

  //-- service mocks
  val mockPaypalService: PaypalService = mock[PaypalService]
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockOphanService: AnalyticsService = mock[AnalyticsService]
  val mockBigQueryService: BigQueryService = mock[BigQueryService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]
  val mockAcquisitionsStreamService: AcquisitionsStreamService = mock[AcquisitionsStreamService]

  //-- test obj
  val paypalBackend = new PaypalBackend(
    mockPaypalService,
    mockDatabaseService,
    mockIdentityService,
    mockOphanService,
    mockBigQueryService,
    mockAcquisitionsStreamService,
    mockEmailService,
    mockCloudWatchService)(new DefaultThreadPool(ec))

  // This is only needed if testing code which depends on extracting data from Payment object
  def populatePaymentMock(): Unit = {
    when(enrichedPaymentMock.payment).thenReturn(paymentMock)
    when(enrichedPaymentMock.email).thenReturn(Some("email@email.com"))
    when(paymentMock.getPayer).thenReturn(payer)
    when(paymentMock.getTransactions).thenReturn(transactions)
    when(paymentMock.getCreateTime).thenReturn("2018-02-22T11:51:00Z")
    when(transaction.getAmount).thenReturn(amount)
    when(amount.getCurrency).thenReturn("GBP")
    when(amount.getTotal).thenReturn("2")
    when(payer.getPayerInfo).thenReturn(payerInfo)
    when(payerInfo.getCountryCode).thenReturn("uk")
    when(payerInfo.getEmail).thenReturn("email@email.com")
    when(payerInfo.getFirstName).thenReturn("Peter")
    ()
  }
}


class PaypalBackendSpec
  extends AnyWordSpec
    with Matchers
    with FutureEitherValues
    with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val clientBrowserInfo =  ClientBrowserInfo("","",None,None,None)

  "Paypal Backend" when {

    "a request is made to create a payment" should {

      "return payment if service returns payment successfully" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(Currency.GBP, BigDecimal(3), "return-url", "cancel-url")
        when(mockPaypalService.createPayment(createPaypalPaymentData)).thenReturn(paymentServiceResponse)
        paypalBackend.createPayment(createPaypalPaymentData).futureRight mustBe paymentMock
      }

      "return error if service fails" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(Currency.GBP, BigDecimal(3), "return-url", "cancel-url")
        when(mockPaypalService.createPayment(createPaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.createPayment(createPaypalPaymentData).futureLeft mustBe
          PaypalApiError(None, None, "Error response")
      }

    }

    "a request is made to capture a payment" should {

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(mockPaypalService.capturePayment(capturePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.capturePayment(capturePaypalPaymentData, clientBrowserInfo).futureLeft mustBe
          paymentError

      }

      "return successful payment response even if identityService, ophanService, " +
        "databaseService and emailService fail" in new PaypalBackendFixture {
        populatePaymentMock()
        val enrichedPaypalPaymentMock = EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail))
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponseError)
        when(mockPaypalService.capturePayment(capturePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
        paypalBackend
          .capturePayment(capturePaypalPaymentData, clientBrowserInfo)
          .futureRight mustBe enrichedPaypalPaymentMock
      }
    }

    "a request is made to execute a payment" should {

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.executePayment(executePaypalPaymentData, clientBrowserInfo)
          .futureLeft mustBe paymentError

      }

      "return successful payment response even if identityService, " +
        "ophanService, databaseService and emailService fail" in new PaypalBackendFixture {
        populatePaymentMock()
        val enrichedPaypalPaymentMock = EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail))
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponseError)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)

        paypalBackend.executePayment(executePaypalPaymentData, clientBrowserInfo).futureRight mustBe enrichedPaypalPaymentMock
      }

      "return successful payment response with guestAccountRegistrationToken if available" in new PaypalBackendFixture {
        populatePaymentMock()
        val enrichedPaypalPaymentMock = EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail))
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponseError)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)

        paypalBackend.executePayment(executePaypalPaymentData, clientBrowserInfo).futureRight mustBe enrichedPaypalPaymentMock
      }
    }

    "a request is made to process a refund hook" should {

      "return error if refund hook is not valid" in new PaypalBackendFixture {
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponseError)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureLeft mustBe backendPaymentError
      }

      "return error if databaseService fails" in new PaypalBackendFixture {
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureLeft mustBe backendDbError
      }

      "return success if refund hook is valid and databaseService succeeds" in new PaypalBackendFixture {
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponse)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureRight mustBe(())
      }
    }

    "tracking the contribution" should {

      "return just a DB error if Ophan succeeds but DB fails" in new PaypalBackendFixture {
        populatePaymentMock()

        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponse)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)


        val trackContribution = PrivateMethod[Future[List[BackendError]]]('trackContribution)
        val result = paypalBackend invokePrivate trackContribution(paymentMock, acquisitionData, "a@b.com", None, clientBrowserInfo)

        result.futureValue mustBe List(BackendError.Database(dbError))
      }

      "return a combined error if Ophan and DB fail" in new PaypalBackendFixture {
        populatePaymentMock()

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponse)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponse)

        val trackContribution = PrivateMethod[Future[List[BackendError]]]('trackContribution)
        val errors = List(
          BackendError.fromOphanError(ophanError),
          BackendError.Database(dbError)
        )
        val result = paypalBackend invokePrivate trackContribution(paymentMock, acquisitionData, "a@b.com", None, clientBrowserInfo)
        result.futureValue mustBe errors
      }

      "return a combined error if Ophan and BigQuery fail" in new PaypalBackendFixture {
        populatePaymentMock()

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponse)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any())).thenReturn(streamResponseError)
        val trackContribution = PrivateMethod[Future[List[BackendError]]]('trackContribution)
        val errors = List(
          BackendError.fromOphanError(ophanError),
          BackendError.BigQueryError(bigQueryErrorMessage),
          BackendError.AcquisitionsStreamError(streamResponseErrorMessage)
        )
        val result = paypalBackend invokePrivate trackContribution(paymentMock, acquisitionData, "a@b.com", None, clientBrowserInfo)
        result.futureValue mustEqual errors
      }

    }

  }
}
