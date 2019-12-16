package backend

import cats.data.EitherT
import cats.implicits._
import com.amazon.pay.response.ipn.model.RefundNotification
import com.amazon.pay.response.model._
import com.amazon.pay.response.parser.{CloseOrderReferenceResponseData, ConfirmOrderReferenceResponseData, ResponseData}
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.AnalyticsServiceError
import javax.xml.datatype.DatatypeFactory
import model._
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError, AmazonPayResponse, AmazonPaymentData}
import org.mockito.Matchers.any
import org.mockito.Mockito
import org.mockito.Mockito.{verify, when}
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{Matchers, WordSpec}
import services._
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}


class AmazonPayBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {


  //-- entities
  val acquisitionData = AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None, None)
  val countrySubdivisionCode = Some("NY")
  val ophanError: List[AnalyticsServiceError] = List(AnalyticsServiceError.BuildError("Ophan error response"))
  val dbError = ContributionsStoreService.Error(new Exception("DB error response"))
  val identityError = IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("test@theguardian.com")
  )
  val expectedGuestToken = Some("guest-token")

  val paymentError = AmazonPayApiError.fromString("Error response")

  val emailError: EmailService.Error = EmailService.Error(new Exception("Email error response"))
  val responseXml =
    <RefundNotification xmlns="https://mws.amazonservices.com/ipn/OffAmazonPayments/2013-01-01">
      <RefundDetails>
        <AmazonRefundId>P01-0000000-0000000-000000</AmazonRefundId> <RefundReferenceId>P01-0000000-0000000-Ref</RefundReferenceId> <RefundType>SellerInitiated</RefundType>
        <RefundAmount>
          <Amount>3.0</Amount>
          <CurrencyCode>USD</CurrencyCode>
        </RefundAmount>
        <FeeRefunded>
          <Amount>2.0</Amount>
          <CurrencyCode>USD</CurrencyCode>
        </FeeRefunded>
        <CreationTimestamp>2013-01-01T01:01:01.001Z</CreationTimestamp>
        <RefundStatus>
          <State>Completed</State>
          <LastUpdateTimestamp>2013-01-01T01:01:01.001Z</LastUpdateTimestamp> <ReasonCode>None</ReasonCode>
        </RefundStatus>
        <SoftDescriptor>AMZ*softDescriptor</SoftDescriptor>
      </RefundDetails>
    </RefundNotification>


  val paymentServiceResponseError: Either[AmazonPayApiError, OrderReferenceDetails] =
    Either.left(paymentError)
  val mockOrderRef = mock[OrderReferenceDetails]

  val mockConfirmOrderResponse = mock[ConfirmOrderReferenceResponse]
  val mockOrderTotal = mock[OrderTotal]
  val responseData = new ResponseData(200, responseXml.toString)
  val confirmOrderData = new ConfirmOrderReferenceResponseData(mockConfirmOrderResponse, responseData )
  val mockAuthorizationDetails = mock[AuthorizationDetails]
  val mockCloseResponseDetails = mock[CloseOrderReferenceResponse]
  val mockOrderReferenceStatus = mock[OrderReferenceStatus]
  val mockAuthStatus = mock[Status]

  val setOrderRefRes: Either[AmazonPayApiError, OrderReferenceDetails] = Either.right(mockOrderRef)
  val getOrderRefRes: Either[AmazonPayApiError, OrderReferenceDetails] = Either.right(mockOrderRef)
  val mockConfirmRes: Either[AmazonPayApiError, ConfirmOrderReferenceResponseData] = Either.right(confirmOrderData)
  val mockAuthResponse:  Either[AmazonPayApiError, AuthorizationDetails] = Either.right(mockAuthorizationDetails)
  val mockCloseResponse:  Either[AmazonPayApiError, CloseOrderReferenceResponseData] = Either.right(new CloseOrderReferenceResponseData(mockCloseResponseDetails, responseData))

  val unitPaymentResponse: EitherT[Future, AmazonPayApiError, Unit] =
    EitherT.right(Future.successful(()))
  val unitPaymentResponseError: EitherT[Future, AmazonPayApiError, Unit] =
    EitherT.left(Future.successful(paymentError))
  val acquisitionResponse: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.right(Future.successful(mock[AcquisitionSubmission]))
  val acquisitionResponseError: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))
  val databaseResponse: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val databaseResponseError: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, IdentityIdWithGuestAccountCreationToken] =
    EitherT.right(Future.successful(IdentityIdWithGuestAccountCreationToken(1L, expectedGuestToken)))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, IdentityIdWithGuestAccountCreationToken] =
    EitherT.left(Future.successful(identityError))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(emailError))


  //-- service mocks
  val mockAmazonPayService: AmazonPayService = mock[AmazonPayService]
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockOphanService: AnalyticsService = mock[AnalyticsService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  //-- test obj
  val amazonPayBackend = new AmazonPayBackend(
    mockCloudWatchService,
    mockAmazonPayService,
    mockIdentityService,
    mockEmailService,
    mockOphanService,
    mockDatabaseService
  )(new DefaultThreadPool(ec))

  val paymentdata= AmazonPaymentData("refId", BigDecimal(25), Currency.USD, "email@gu.com")
  val amazonPayRequest = AmazonPayRequest(paymentdata, Some(acquisitionData))

}

class AmazonPayBackendSpec extends WordSpec
  with Matchers
  with FutureEitherValues
  with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, None)

  "Amazon Pay Backend" when {
    "refund" should {
      "convert refundId to OrderRef" in new AmazonPayBackendFixture {
        amazonPayBackend.refundIdToOrderRef("S23-1234567-1234567-0000003") shouldBe "S23-1234567-1234567"
      }


      "a request is made to create a charge/payment" should {
        "return error if amazonPay service fails" in new AmazonPayBackendFixture {
          when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
          when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
          when(mockOrderReferenceStatus.getState).thenReturn("Open")
          when(mockAmazonPayService.setOrderReference(paymentdata)).thenReturn(paymentServiceResponseError)
          amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureLeft shouldBe paymentError
        }
      }
    }

    "request" should {
      "return successful payment response even if identityService, " +
        "ophanService, databaseService and emailService all fail" in new AmazonPayBackendFixture {
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Open")
        when(mockAmazonPayService.setOrderReference(any())).thenReturn(setOrderRefRes)
        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthorizationDetails.getAuthorizationAmount).thenReturn(new Price("50.00", "USD"))
        when(mockAuthStatus.getState).thenReturn("Closed")
        when(mockAmazonPayService.close(any())).thenReturn(mockCloseResponse)
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(DatatypeFactory.newInstance().newXMLGregorianCalendar())

        when(mockOrderRef.getOrderTotal).thenReturn(mockOrderTotal)
        when(mockOrderTotal.getCurrencyCode).thenReturn("USD")
        when(mockOrderTotal.getAmount).thenReturn("25")

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@gu.com")).thenReturn(identityResponseError)
        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureRight shouldBe AmazonPayResponse(None)
      }

      "return successful payment response with guestAccountRegistrationToken if available" in new AmazonPayBackendFixture {
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Draft")
        when(mockAmazonPayService.setOrderReference(any())).thenReturn(setOrderRefRes)
        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthStatus.getState).thenReturn("Closed")
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(DatatypeFactory.newInstance().newXMLGregorianCalendar())
        when(mockAuthorizationDetails.getAuthorizationAmount).thenReturn(new Price("50.00", "USD"))
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@gu.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureRight shouldBe AmazonPayResponse(expectedGuestToken)
      }

      "Not call setOrderRef if state is suspended" in new AmazonPayBackendFixture {
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Suspended")

        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthStatus.getState).thenReturn("Closed")
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(DatatypeFactory.newInstance().newXMLGregorianCalendar())

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@gu.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        verify(mockAmazonPayService, Mockito.times(0)).setOrderReference(any())
      }

      "Return an error when card is declined" in new AmazonPayBackendFixture {
        val expectedReason = "some reason"
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Draft")
        when(mockAmazonPayService.setOrderReference(any())).thenReturn(setOrderRefRes)
        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthStatus.getState).thenReturn("Declined")
        when(mockAuthStatus.getReasonCode).thenReturn(expectedReason)
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(DatatypeFactory.newInstance().newXMLGregorianCalendar())
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)

        when(mockOphanService.submitAcquisition(any())(any())).thenReturn(acquisitionResponseError)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@gu.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureLeft shouldBe AmazonPayApiError.withReason(200, s"Declined with reason $expectedReason", expectedReason)

      }

      "a request is made to process a refund hook" should {

        "return error if refund hook is not valid" in new AmazonPayBackendFixture {
          val mockNotification = mock[RefundNotification]

          when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
          amazonPayBackend.handleNotification(mockNotification).futureLeft shouldBe BackendError.AmazonPayApiError(new AmazonPayApiError(Some(503), "Something went wrong handling the refund"))
        }
      }
    }
  }
}

