package backend

import cats.data.EitherT
import cats.implicits._
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.stripe.model.{Charge, Event, ExternalAccount}
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
  val acquisitionData = AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None)
  val stripePaymentData = StripePaymentData("email@email.com", Currency.USD, 12, "token")
  val stripeChargeData = StripeChargeData(stripePaymentData, acquisitionData, None)
  val stripeHookObject = StripeHookObject("id", "GBP")
  val stripeHookData = StripeHookData(stripeHookObject)
  val stripeHook = StripeRefundHook("id", PaymentStatus.Paid, stripeHookData)
  val ophanError = OphanServiceError.BuildError("Ophan error response")
  val dbError = DatabaseService.Error("DB error response", None)
  val identityError = IdentityClient.Error.fromThrowable(new Exception("Identity error response"))
  val paymentError = PaypalApiError.fromString("Error response")
  val stripeApiError = StripeApiError.fromThrowable(new Exception("Stripe error"))
  val backendError = BackendError.fromStripeApiError(stripeApiError)

  //-- mocks
  val chargeMock: Charge = mock[Charge]
  val eventMock = mock[Event]

  //-- service responses
  val paymentServiceResponse: EitherT[Future, StripeApiError, Charge] =
    EitherT.right(Future.successful(chargeMock))
  val paymentServiceResponseError: EitherT[Future, StripeApiError, Charge] =
    EitherT.left(Future.successful(stripeApiError))
  val acquisitionResponseError: EitherT[Future, OphanServiceError, AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))
  val identityResponse: EitherT[Future, IdentityClient.Error, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.Error, Long] =
    EitherT.left(Future.successful(identityError))
  val validateRefundHookSuccess: EitherT[Future, StripeApiError, Unit] =
    EitherT.right(Future.successful(()))
  val validateRefundHookFailure: EitherT[Future, StripeApiError, Unit] =
    EitherT.left(Future.successful(stripeApiError))
  val databaseFailure: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val databaseSuccess: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.right(Future.successful(()))

  //-- service mocks
  val mockStripeService: StripeService = mock[StripeService]
  val mockDatabaseService: DatabaseService = mock[DatabaseService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockOphanService: OphanService = mock[OphanService]
  val mockEmailService: EmailService = mock[EmailService]

  //-- test obj
  val stripeBackend = new StripeBackend(
    mockStripeService,
    mockDatabaseService,
    mockIdentityService,
    mockOphanService,
    mockEmailService)(new DefaultThreadPool(ec))
}


class StripeBackendSpec
  extends WordSpec
    with Matchers
    with FutureEitherValues
    with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  "Stripe Backend" when {

    "a request is made to create a charge/payment" should {

      "return combined error while tracking contribution if ophan and db fail" in new StripeBackendFixture {
        val externalAccount = new ExternalAccount()
        when(chargeMock.getId).thenReturn("id")
        when(chargeMock.getReceiptEmail).thenReturn("email@email.com")
        when(chargeMock.getCreated).thenReturn(123123123132L)
        when(chargeMock.getCurrency).thenReturn("GBP")
        when(chargeMock.getAmount).thenReturn(12L)
        when(chargeMock.getSource).thenReturn(externalAccount)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseFailure)
        val trackContribution = PrivateMethod[EitherT[Future, BackendError,Unit]]('trackContribution)
        val result = stripeBackend invokePrivate trackContribution(chargeMock, stripeChargeData, None)
        val error = BackendError.MultipleErrors(List(
          BackendError.Database(DatabaseService.Error("DB error response", None)),
          BackendError.fromOphanError(OphanServiceError.BuildError("Ophan error response")))
        )
        result.futureLeft shouldBe error
      }

      "return error if stripe service fails" in new StripeBackendFixture {
        when(mockStripeService.createCharge(stripeChargeData)).thenReturn(paymentServiceResponseError)
        stripeBackend.createCharge(stripeChargeData).futureLeft shouldBe BackendError.fromStripeApiError(stripeApiError)

      }

      "return successful payment response even if identityService - " +
        "ophanService - databaseService - emailService fail" in new StripeBackendFixture {
        val externalAccount = new ExternalAccount()
        when(chargeMock.getId).thenReturn("id")
        when(chargeMock.getReceiptEmail).thenReturn("email@email.com")
        when(chargeMock.getCreated).thenReturn(123123123132L)
        when(chargeMock.getCurrency).thenReturn("GBP")
        when(chargeMock.getAmount).thenReturn(12L)
        when(chargeMock.getSource).thenReturn(externalAccount)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseFailure)
        when(mockStripeService.createCharge(stripeChargeData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)
        stripeBackend.createCharge(stripeChargeData).futureRight shouldBe StripeChargeSuccess.fromCharge(chargeMock)
      }
    }

    "a request is made to a payment hook" should {

      "return error if refund hook is not valid" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookFailure)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseFailure)
        stripeBackend.processRefundHook(stripeHook).futureLeft shouldBe backendError
      }

      "return error if databaseService fails" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookSuccess)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseFailure)
        stripeBackend.processRefundHook(stripeHook).futureLeft shouldBe BackendError.fromDatabaseError(dbError)
      }

      "return success if refund hook is valid and databaseService succeeds" in new StripeBackendFixture {
        when(mockStripeService.validateRefundHook(stripeHook)).thenReturn(validateRefundHookSuccess)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseSuccess)
        stripeBackend.processRefundHook(stripeHook).futureRight shouldBe(())
      }

    }
  }
}
