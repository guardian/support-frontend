package backend

import cats.data.EitherT
import cats.implicits._
import com.amazon.pay.response.ipn.model.{AuthorizationNotification, NotificationType}
import com.amazon.pay.response.model._
import com.amazon.pay.response.parser.{CloseOrderReferenceResponseData, ConfirmOrderReferenceResponseData, ResponseData}
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.support.acquisitions.ga.{GoogleAnalyticsService, GoogleAnalyticsServiceMock}
import com.gu.support.acquisitions.{AcquisitionsStreamService, BigQueryService}

import javax.xml.datatype.DatatypeFactory
import model._
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError, AmazonPaymentData}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito
import org.mockito.Mockito.{verify, when}
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import services.SwitchState.{Off, On}
import services._
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}

class AmazonPayBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  // -- entities
  val acquisitionData =
    AcquisitionData(Some("platform"), None, None, None, None, None, None, None, None, None, None, None, None, None)
  val countrySubdivisionCode = Some("NY")
  val dbError = ContributionsStoreService.Error(new Exception("DB error response"))
  val identityError = IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("test@theguardian.com"),
  )
  val expectedGuestToken = Some("guest-token")

  val paymentError = AmazonPayApiError.fromString("Error response")
  val amazonPaySwitchError = AmazonPayApiError.fromString("Amazon Pay Switch not enabled")

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
  val confirmOrderData = new ConfirmOrderReferenceResponseData(mockConfirmOrderResponse, responseData)
  val mockAuthorizationDetails = mock[AuthorizationDetails]
  val mockCloseResponseDetails = mock[CloseOrderReferenceResponse]
  val mockOrderReferenceStatus = mock[OrderReferenceStatus]
  val mockAuthStatus = mock[Status]

  val setOrderRefRes: Either[AmazonPayApiError, OrderReferenceDetails] = Either.right(mockOrderRef)
  val getOrderRefRes: Either[AmazonPayApiError, OrderReferenceDetails] = Either.right(mockOrderRef)
  val mockConfirmRes: Either[AmazonPayApiError, ConfirmOrderReferenceResponseData] = Either.right(confirmOrderData)
  val mockAuthResponse: Either[AmazonPayApiError, AuthorizationDetails] = Either.right(mockAuthorizationDetails)
  val mockCloseResponse: Either[AmazonPayApiError, CloseOrderReferenceResponseData] =
    Either.right(new CloseOrderReferenceResponseData(mockCloseResponseDetails, responseData))

  val unitPaymentResponse: EitherT[Future, AmazonPayApiError, Unit] =
    EitherT.right(Future.successful(()))
  val unitPaymentResponseError: EitherT[Future, AmazonPayApiError, Unit] =
    EitherT.left(Future.successful(paymentError))
  val databaseResponse: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val databaseResponseError: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val supporterProductDataResponseError: EitherT[Future, String, Unit] =
    EitherT.left(Future.successful("an error from supporter product data"))
  val bigQueryResponse: EitherT[Future, List[String], Unit] =
    EitherT.right(Future.successful(()))
  val bigQueryResponseError: EitherT[Future, List[String], Unit] =
    EitherT.left(Future.successful(List("a BigQuery error")))
  val streamResponseError: EitherT[Future, List[String], Unit] =
    EitherT.left(Future.successful(List("stream error")))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.right(Future.successful(1L))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, Long] =
    EitherT.left(Future.successful(identityError))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.left(Future.successful(emailError))
  val switchServiceOnResponse: EitherT[Future, Nothing, Switches] =
    EitherT.right(
      Future.successful(
        Switches(
          Some(RecaptchaSwitches(RecaptchaSwitchTypes(SwitchDetails(On), SwitchDetails(On)))),
          Some(
            OneOffPaymentMethodsSwitches(
              OneOffPaymentMethodsSwitchesTypes(
                SwitchDetails(On),
                SwitchDetails(On),
                SwitchDetails(On),
                SwitchDetails(On),
                SwitchDetails(On),
              ),
            ),
          ),
        ),
      ),
    )

  // -- service mocks
  val mockAmazonPayService: AmazonPayService = mock[AmazonPayService]
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockGaService: GoogleAnalyticsService = GoogleAnalyticsServiceMock
  val mockBigQueryService: BigQueryService = mock[BigQueryService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]
  val mockAcquisitionsStreamService: AcquisitionsStreamService = mock[AcquisitionsStreamService]
  val mockSupporterProductDataService: SupporterProductDataService = mock[SupporterProductDataService]
  val mockSwitchService: SwitchService = mock[SwitchService]

  // -- test obj
  val amazonPayBackend = new AmazonPayBackend(
    mockCloudWatchService,
    mockAmazonPayService,
    mockIdentityService,
    mockEmailService,
    mockGaService,
    mockBigQueryService,
    mockAcquisitionsStreamService,
    mockDatabaseService,
    mockSupporterProductDataService,
    mockSwitchService,
  )(new DefaultThreadPool(ec))

  val paymentdata = AmazonPaymentData("refId", BigDecimal(25), Currency.USD, "email@thegulocal.com")
  val amazonPayRequest = AmazonPayRequest(paymentdata, Some(acquisitionData))

}

class AmazonPayBackendSpec extends AnyWordSpec with Matchers with FutureEitherValues with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, None)

  "Amazon Pay Backend" when {
    "A request is made to create a charge/payment " should {
      "return error if amazonPay switch is disabled in support-admin-console " in new AmazonPayBackendFixture {
        val switchServiceOffResponse: EitherT[Future, Nothing, Switches] =
          EitherT.right(
            Future.successful(
              Switches(
                Some(RecaptchaSwitches(RecaptchaSwitchTypes(SwitchDetails(On), SwitchDetails(On)))),
                Some(
                  OneOffPaymentMethodsSwitches(
                    OneOffPaymentMethodsSwitchesTypes(
                      SwitchDetails(On),
                      SwitchDetails(On),
                      SwitchDetails(On),
                      SwitchDetails(On),
                      SwitchDetails(Off),
                    ),
                  ),
                ),
              ),
            ),
          )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOffResponse)
        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureLeft mustBe amazonPaySwitchError
      }
      "return Success  if amazonPay switch is On in support-admin-console " in new AmazonPayBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
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
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(
          DatatypeFactory.newInstance().newXMLGregorianCalendar(),
        )
        when(mockOrderRef.getOrderTotal).thenReturn(mockOrderTotal)
        when(mockOrderTotal.getCurrencyCode).thenReturn("USD")
        when(mockOrderTotal.getAmount).thenReturn("25")
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any()))
          .thenReturn(streamResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@thegulocal.com"))
          .thenReturn(identityResponseError)
        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureRight mustBe ()
      }
    }

    "refund" should {
      "convert refundId to OrderRef" in new AmazonPayBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        amazonPayBackend.refundIdToOrderRef("S23-1234567-1234567-0000003") mustBe "S23-1234567-1234567"
      }

      "a request is made to create a charge/payment" should {
        "return error if amazonPay service fails" in new AmazonPayBackendFixture {
          when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
          when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
          when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
          when(mockOrderReferenceStatus.getState).thenReturn("Open")
          when(mockAmazonPayService.setOrderReference(paymentdata)).thenReturn(paymentServiceResponseError)
          amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureLeft mustBe paymentError
        }
      }
    }

    "request" should {
      "return successful payment response even if identityService, " +
        "databaseService, supporterProductDataService, bigQueryService and emailService all fail" in new AmazonPayBackendFixture {
          when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
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
          when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(
            DatatypeFactory.newInstance().newXMLGregorianCalendar(),
          )

          when(mockOrderRef.getOrderTotal).thenReturn(mockOrderTotal)
          when(mockOrderTotal.getCurrencyCode).thenReturn("USD")
          when(mockOrderTotal.getAmount).thenReturn("25")

          when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
          when(mockSupporterProductDataService.insertContributionData(any())(any()))
            .thenReturn(supporterProductDataResponseError)
          when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
          when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any()))
            .thenReturn(streamResponseError)
          when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@thegulocal.com"))
            .thenReturn(identityResponseError)
          amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureRight mustBe ()
        }

      "return successful payment response with guestAccountRegistrationToken if available" in new AmazonPayBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Draft")
        when(mockAmazonPayService.setOrderReference(any())).thenReturn(setOrderRefRes)
        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthStatus.getState).thenReturn("Closed")
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(
          DatatypeFactory.newInstance().newXMLGregorianCalendar(),
        )
        when(mockAuthorizationDetails.getAuthorizationAmount).thenReturn(new Price("50.00", "USD"))
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponseError)
        when(mockBigQueryService.tableInsertRowWithRetry(any(), any[Int])(any())).thenReturn(bigQueryResponseError)
        when(mockAcquisitionsStreamService.putAcquisitionWithRetry(any(), any[Int])(any()))
          .thenReturn(streamResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@thegulocal.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureRight mustBe ()
      }

      "Not call setOrderRef if state is suspended" in new AmazonPayBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Suspended")

        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthStatus.getState).thenReturn("Closed")
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(
          DatatypeFactory.newInstance().newXMLGregorianCalendar(),
        )

        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@thegulocal.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        verify(mockAmazonPayService, Mockito.times(0)).setOrderReference(any())
      }

      "Return an error when card is declined" in new AmazonPayBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
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
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(
          DatatypeFactory.newInstance().newXMLGregorianCalendar(),
        )
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)

        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@thegulocal.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureLeft mustBe
          AmazonPayApiError.withReason(200, s"Declined with reason $expectedReason", expectedReason)

      }

      "Call cancel when transaction times out " in new AmazonPayBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        val expectedReason = "some reason"
        when(mockAmazonPayService.getOrderReference(any())).thenReturn(getOrderRefRes)
        when(mockOrderRef.getOrderReferenceStatus).thenReturn(mockOrderReferenceStatus)
        when(mockOrderReferenceStatus.getState).thenReturn("Draft")
        when(mockAmazonPayService.setOrderReference(any())).thenReturn(setOrderRefRes)
        when(mockAmazonPayService.confirmOrderReference(any())).thenReturn(mockConfirmRes)
        when(mockAmazonPayService.authorize(any(), any())).thenReturn(mockAuthResponse)
        when(mockAuthorizationDetails.getAuthorizationStatus).thenReturn(mockAuthStatus)
        when(mockAuthStatus.getState).thenReturn("Declined")
        when(mockAuthStatus.getReasonCode).thenReturn("TransactionTimedOut")
        when(mockAuthorizationDetails.getCreationTimestamp).thenReturn(
          DatatypeFactory.newInstance().newXMLGregorianCalendar(),
        )
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@thegulocal.com")).thenReturn(identityResponse)
        when(mockEmailService.sendThankYouEmail(any())).thenReturn(emailResponseError)

        amazonPayBackend.makePayment(amazonPayRequest, clientBrowserInfo).futureLeft mustBe
          AmazonPayApiError.withReason(200, s"Declined with reason TransactionTimedOut", "TransactionTimedOut")
        verify(mockAmazonPayService).cancelOrderReference(any())
      }

      "a request is made to process a refund hook" should {

        "return Unit if not a refund" in new AmazonPayBackendFixture {
          when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
          val mockNotification = mock[AuthorizationNotification]
          when(mockNotification.getNotificationType).thenReturn(NotificationType.AuthorizationNotification)

          amazonPayBackend.handleNotification(mockNotification).futureRight mustBe ()
        }
      }
    }
  }
}
