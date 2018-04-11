package backend

import cats.data.EitherT
import com.gu.acquisition.model.AcquisitionSubmission
import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment}
import org.scalatest.{Matchers, WordSpec}
import org.scalatest.mockito.MockitoSugar
import model.{AcquisitionData, _}
import model.paypal.{HookAmount, PaypalHook, Resource, _}
import org.scalatest.PrivateMethodTester._

import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future}
import org.mockito.Mockito._
import org.mockito.Matchers._
import org.scalatest.concurrent.IntegrationPatience
import services._
import util.FutureEitherValues
import cats.implicits._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.acquisition.model.errors.OphanServiceError
import org.joda.time.DateTime

class PaypalBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  //-- entities
  val acquisitionData = AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None)
  val capturePaypalPaymentData = CapturePaypalPaymentData(CapturePaymentData("paymentId"), acquisitionData, None)
  val executePaypalPaymentData = ExecutePaypalPaymentData(
    ExecutePaymentData("paymentId", "payerId"), acquisitionData, None
  )
  val hookAmount = HookAmount(BigDecimal(1), "GBP")
  val resource = Resource(DateTime.now(), hookAmount, None, "parent_payment")
  val paypalHook = PaypalHook(PaymentStatus.Paid, resource)
  val ophanError = OphanServiceError.BuildError("Ophan error response")
  val dbError = DatabaseService.Error("DB error response", None)
  val identityError = IdentityClient.Error.fromThrowable(new Exception("Identity error response"))
  val paymentError = PaypalApiError.fromString("Error response")

  //-- mocks
  val paymentMock: Payment = mock[Payment]
  val amount = mock[Amount]
  val payer = mock[Payer]
  val payerInfo = mock[PayerInfo]
  val transaction = mock[com.paypal.api.payments.Transaction]
  val transactions = List(transaction).asJava
  val mockAcquisitionData = mock[AcquisitionData]

  //-- service responses
  val paymentServiceResponse: EitherT[Future, PaypalApiError, Payment] =
    EitherT.right(Future.successful(paymentMock))
  val paymentServiceResponseError: EitherT[Future, PaypalApiError, Payment] =
    EitherT.left(Future.successful(paymentError))
  val unitPaymentResponse: EitherT[Future, PaypalApiError, Unit] =
    EitherT.right(Future.successful(()))
  val unitPaymentResponseError: EitherT[Future, PaypalApiError, Unit] =
    EitherT.left(Future.successful(paymentError))
  val acquisitionResponseError: EitherT[Future, OphanServiceError, AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))
  val unitResponse: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val unitResponseError: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val identityResponse: EitherT[Future, IdentityClient.Error, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.Error, Long] =
    EitherT.left(Future.successful(identityError))
  val emailResponseError: EitherT[Future, Throwable, SendMessageResult] =
    EitherT.left(Future.successful(new Exception("Email error response")))

  //-- service mocks
  val mockPaypalService: PaypalService = mock[PaypalService]
  val mockDatabaseService: DatabaseService = mock[DatabaseService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockOphanService: OphanService = mock[OphanService]
  val mockEmailService: EmailService = mock[EmailService]

  //-- test obj
  val paypalBackend = new PaypalBackend(
    mockPaypalService,
    mockDatabaseService,
    mockIdentityService,
    mockOphanService,
    mockEmailService)(new DefaultThreadPool(ec))
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
          BackendError.fromPaypalAPIError(PaypalApiError(PaypalErrorType.Other, "Error response"))
      }

    }

    "a request is made to capture a payment" should {

      "return combined error while tracking contribution if ophan and db fail" in new PaypalBackendFixture {
        when(transaction.getAmount).thenReturn(amount)
        when(amount.getCurrency).thenReturn("GBP")
        when(amount.getTotal).thenReturn("2")
        when(payerInfo.getCountryCode).thenReturn("uk")
        when(payerInfo.getEmail).thenReturn("email@email.com")
        when(payer.getPayerInfo).thenReturn(payerInfo)
        when(paymentMock.getPayer).thenReturn(payer)
        when(paymentMock.getTransactions).thenReturn(transactions)
        when(paymentMock.getCreateTime).thenReturn("2018-02-22T11:51:00Z")
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(unitResponseError)
        val trackContribution = PrivateMethod[EitherT[Future, BackendError, Unit]]('trackContribution)
        val error = BackendError.MultipleErrors(List(BackendError.fromOphanError(
          OphanServiceError.BuildError("Ophan error response")),
          BackendError.Database(DatabaseService.Error("DB error response", None)))
        )
        val result = paypalBackend invokePrivate trackContribution(paymentMock, mockAcquisitionData, None)
        result.futureLeft shouldBe error
      }

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(paymentMock.getPayer).thenReturn(payer)
        when(payer.getPayerInfo).thenReturn(payerInfo)
        when(payerInfo.getEmail).thenReturn("email@email.com")
        when(mockPaypalService.capturePayment(capturePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.capturePayment(capturePaypalPaymentData).futureLeft shouldBe
          BackendError.fromPaypalAPIError(paymentError)

      }

      "return successful payment response even if identityService - ophanService " +
        "- databaseService - emailService fail" in new PaypalBackendFixture {
        when(paymentMock.getPayer).thenReturn(payer)
        when(payer.getPayerInfo).thenReturn(payerInfo)
        when(payerInfo.getEmail).thenReturn("email@email.com")
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(unitResponseError)
        when(mockPaypalService.capturePayment(capturePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
        paypalBackend.capturePayment(capturePaypalPaymentData).futureRight shouldBe paymentMock
      }
    }

    "a request is made to execute a payment" should {

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(paymentMock.getPayer).thenReturn(payer)
        when(payer.getPayerInfo).thenReturn(payerInfo)
        when(payerInfo.getEmail).thenReturn("email@email.com")
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.executePayment(executePaypalPaymentData)
          .futureLeft shouldBe BackendError.fromPaypalAPIError(paymentError)

      }

      "return successful payment response even if identityService " +
        "- ophanService - databaseService - emailService fail" in new PaypalBackendFixture {
        when(paymentMock.getPayer).thenReturn(payer)
        when(payer.getPayerInfo).thenReturn(payerInfo)
        when(payerInfo.getEmail).thenReturn("email@email.com")
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(unitResponseError)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
        paypalBackend.executePayment(executePaypalPaymentData).futureRight shouldBe paymentMock
      }
    }

    "a request is made to a payment hook" should {

      "return error if payment is not valid" in new PaypalBackendFixture {
        when(mockPaypalService.validateEvent(any(), any())).thenReturn(unitPaymentResponseError)
        when(mockDatabaseService.updatePaymentHook(any(), any())).thenReturn(unitResponseError)
        paypalBackend.processPaymentHook(paypalHook, Map.empty, "JSON").futureLeft shouldBe paymentError
      }

      "return successful response even if databaseService fails" in new PaypalBackendFixture {
        when(mockPaypalService.validateEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.updatePaymentHook(any(), any())).thenReturn(unitResponseError)
        paypalBackend.processPaymentHook(paypalHook, Map.empty, "JSON").futureRight shouldBe (())
      }
    }
  }
}
