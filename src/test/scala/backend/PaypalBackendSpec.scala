package backend

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment}
import model.paypal._
import model._
import org.mockito.Matchers._
import org.mockito.Matchers.{eq => mockitoEq}
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{Matchers, WordSpec}
import services._
import util.FutureEitherValues

import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future}

class PaypalBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  //-- entities
  val acquisitionData = AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None)
  val capturePaypalPaymentData = CapturePaypalPaymentData(CapturePaymentData("paymentId"), acquisitionData, None)
  val countrySubdivisionCode = Some("NY")
  val executePaypalPaymentData = ExecutePaypalPaymentData(
    ExecutePaymentData("paymentId", "payerId"), acquisitionData, None
  )
  val paypalRefundWebHookData = PaypalRefundWebHookData(
    body = PaypalRefundWebHookBody("parent_payment_id", "{}"),
    headers = Map.empty
  )
  val ophanError = OphanServiceError.BuildError("Ophan error response")
  val dbError = DatabaseService.Error("DB error response", None)

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
  val mockAcquisitionData = mock[AcquisitionData]

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
  val acquisitionResponse: EitherT[Future, OphanServiceError, AcquisitionSubmission] =
    EitherT.right(Future.successful(mock[AcquisitionSubmission]))
  val acquisitionResponseError: EitherT[Future, OphanServiceError, AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))
  val databaseResponse: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val databaseResponseError: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.left(Future.successful(identityError))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(emailError))

  //-- service mocks
  val mockPaypalService: PaypalService = mock[PaypalService]
  val mockDatabaseService: DatabaseService = mock[DatabaseService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockOphanService: OphanService = mock[OphanService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  //-- test obj
  val paypalBackend = new PaypalBackend(
    mockPaypalService,
    mockDatabaseService,
    mockIdentityService,
    mockOphanService,
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
    ()
  }
}


class PaypalBackendSpec
  extends WordSpec
    with Matchers
    with FutureEitherValues
    with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  "Paypal Backend" when {

    "a request is made to create a payment" should {

      "return payment if service returns payment successfully" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(Currency.GBP, BigDecimal(3), "return-url", "cancel-url")
        when(mockPaypalService.createPayment(createPaypalPaymentData)).thenReturn(paymentServiceResponse)
        paypalBackend.createPayment(createPaypalPaymentData).futureRight shouldBe paymentMock
      }

      "return error if service fails" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(Currency.GBP, BigDecimal(3), "return-url", "cancel-url")
        when(mockPaypalService.createPayment(createPaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.createPayment(createPaypalPaymentData).futureLeft shouldBe
          PaypalApiError(None, None, "Error response")
      }

    }

    "a request is made to capture a payment" should {

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(mockPaypalService.capturePayment(capturePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.capturePayment(capturePaypalPaymentData, countrySubdivisionCode).futureLeft shouldBe
          paymentError

      }

      "return successful payment response even if identityService, ophanService, " +
        "databaseService and emailService fail" in new PaypalBackendFixture {
        populatePaymentMock()
        val enrichedPaypalPaymentMock = EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail))
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockPaypalService.capturePayment(capturePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
        paypalBackend
          .capturePayment(capturePaypalPaymentData, countrySubdivisionCode)
          .futureRight shouldBe enrichedPaypalPaymentMock
      }
    }

    "a request is made to execute a payment" should {

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.executePayment(executePaypalPaymentData, countrySubdivisionCode)
          .futureLeft shouldBe paymentError

      }

      "return successful payment response even if identityService, " +
        "ophanService, databaseService and emailService fail" in new PaypalBackendFixture {
        populatePaymentMock()
        val enrichedPaypalPaymentMock = EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail))
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)

        paypalBackend.executePayment(executePaypalPaymentData, countrySubdivisionCode).futureRight shouldBe enrichedPaypalPaymentMock
      }
    }

    "a request is made to process a refund hook" should {

      "return error if refund hook is not valid" in new PaypalBackendFixture {
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponseError)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureLeft shouldBe backendPaymentError
      }

      "return error if databaseService fails" in new PaypalBackendFixture {
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureLeft shouldBe backendDbError
      }

      "return success if refund hook is valid and databaseService succeeds" in new PaypalBackendFixture {
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponse)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureRight shouldBe(())
      }
    }

    "executing post-payment tasks" should {

      "return just an email send error if tracking succeeds but email send fails" in new PaypalBackendFixture {
        populatePaymentMock()

        // All tracking-related services OK
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponse)

        // But email fails
        when(mockEmailService.sendThankYouEmail(any(), anyString(), mockitoEq(1l), mockitoEq(PaymentProvider.Paypal))).thenReturn(emailResponseError)

        val postPaymentTasks = PrivateMethod[EitherT[Future, BackendError, Unit]]('postPaymentTasks)
        val result = paypalBackend invokePrivate postPaymentTasks(enrichedPaymentMock, mockAcquisitionData, countrySubdivisionCode)
        result.futureLeft shouldBe BackendError.Email(emailError)
      }

      "return combined error if tracking and email send fail" in new PaypalBackendFixture {
        populatePaymentMock()

        // Identity and Ophan are  OK
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)

        // But DB - and thus tracking - fails
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)

        // And email fails
        when(mockEmailService.sendThankYouEmail(any(), anyString(), mockitoEq(1l), mockitoEq(PaymentProvider.Paypal))).thenReturn(emailResponseError)

        val postPaymentTasks = PrivateMethod[EitherT[Future, BackendError, Unit]]('postPaymentTasks)
        val errors = BackendError.MultipleErrors(List(
          BackendError.Database(DatabaseService.Error("DB error response", None)),
          BackendError.Email(emailError)
        ))
        val result = paypalBackend invokePrivate postPaymentTasks(enrichedPaymentMock, mockAcquisitionData, countrySubdivisionCode)

        result.futureLeft shouldBe errors
      }
    }

    "tracking the contribution" should {

      "return just a DB error if Ophan succeeds but DB fails" in new PaypalBackendFixture {
        populatePaymentMock()

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)

        val trackContribution = PrivateMethod[EitherT[Future, BackendError, Unit]]('trackContribution)
        val result = paypalBackend invokePrivate trackContribution(paymentMock, mockAcquisitionData, "a@b.com", None, countrySubdivisionCode)

        result.futureLeft shouldBe BackendError.Database(DatabaseService.Error("DB error response", None))
      }

      "return a combined error if Ophan and DB fail" in new PaypalBackendFixture {
        populatePaymentMock()

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)

        val trackContribution = PrivateMethod[EitherT[Future, BackendError, Unit]]('trackContribution)
        val errors = BackendError.MultipleErrors(List(
          BackendError.fromOphanError(
            OphanServiceError.BuildError("Ophan error response")
          ),
          BackendError.Database(DatabaseService.Error("DB error response", None))
        ))
        val result = paypalBackend invokePrivate trackContribution(paymentMock, mockAcquisitionData, "a@b.com", None, countrySubdivisionCode)
        result.futureLeft shouldBe errors
      }
    }

  }
}