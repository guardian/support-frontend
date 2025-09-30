package backend

import backend.BackendError.SoftOptInsServiceError
import cats.data.EitherT
import cats.implicits._
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment}
import model.UserType.Current
import model._
import model.paypal._
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.IntegrationPatience
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import services.SwitchState.{Off, On}
import services._
import software.amazon.awssdk.services.sqs.model.SendMessageResponse
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._

class PaypalBackendFixture(implicit ec: ExecutionContext) extends MockitoSugar {

  // -- entities
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
  val countrySubdivisionCode = Some("NY")
  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, countrySubdivisionCode)
  val executePaypalPaymentData = ExecutePaypalPaymentData(
    ExecutePaymentData("paymentId", "payerId"),
    acquisitionData,
    "email@email.com",
    similarProductsConsent = Some(false),
  )
  val paypalRefundWebHookData = PaypalRefundWebHookData(
    body = PaypalRefundWebHookBody("parent_payment_id", "{}"),
    headers = Map.empty,
  )
  val dbError = ContributionsStoreService.Error(new Exception("DB error response"))

  val identityError = IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("test@theguardian.com"),
  )
  val payPalSwitchError = PaypalApiError.fromString("Paypal Switch not enabled")
  val paymentError = PaypalApiError.fromString("Error response")
  val backendPaymentError = BackendError.fromPaypalAPIError(paymentError)
  val backendDbError = BackendError.fromDatabaseError(dbError)
  val emailError: EmailService.Error = EmailService.Error(new Exception("Email error response"))

  // -- mocks
  val paymentMock: Payment = mock[Payment]
  val enrichedPaymentMock: EnrichedPaypalPayment = mock[EnrichedPaypalPayment]
  val amount = mock[Amount]
  val payer = mock[Payer]
  val payerInfo = mock[PayerInfo]
  val transaction = mock[com.paypal.api.payments.Transaction]
  val transactions = List(transaction).asJava

  // -- service responses
  val paypalSwitchFailResponse: EitherT[Future, PaypalApiError, Payment] =
    EitherT.left(Future.successful(payPalSwitchError))
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
  val databaseResponse: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.right(Future.successful(()))
  val databaseResponseError: EitherT[Future, ContributionsStoreService.Error, Unit] =
    EitherT.left(Future.successful(dbError))
  val supporterProductDataResponse: EitherT[Future, String, Unit] =
    EitherT.right(Future.successful(()))
  val supporterProductDataResponseError: EitherT[Future, String, Unit] =
    EitherT.left(Future.successful("an error from supporter product data"))
  val softOptInsServiceResponse: EitherT[Future, SoftOptInsServiceError, Unit] =
    EitherT.right(Future.successful(()))
  val softOptInsServiceResponseError: EitherT[Future, SoftOptInsServiceError, Unit] =
    EitherT.left(Future.successful(SoftOptInsServiceError("an error from soft opt-ins")))
  val acquisitionsEventBusResponse: Future[Either[String, Unit]] =
    Future.successful(Right(()))
  val acquisitionsEventBusErrorMessage = "an event bus error"
  val acquisitionsEventBusResponseError: Future[Either[String, Unit]] =
    Future.successful(Left(acquisitionsEventBusErrorMessage))
  val identityResponse: EitherT[Future, IdentityClient.ContextualError, IdentityUserDetails] =
    EitherT.right(Future.successful(IdentityUserDetails("1", Current)))
  val identityResponseError: EitherT[Future, IdentityClient.ContextualError, IdentityUserDetails] =
    EitherT.left(Future.successful(identityError))
  val emailResponseError: EitherT[Future, EmailService.Error, SendMessageResponse] =
    EitherT.left(Future.successful(emailError))
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

  // -- service mocks
  val mockPaypalService: PaypalService = mock[PaypalService]
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockAcquisitionsEventBusService: AcquisitionsEventBusService = mock[AcquisitionsEventBusService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]
  val mockSupporterProductDataService: SupporterProductDataService = mock[SupporterProductDataService]
  val mockSwitchService: SwitchService = mock[SwitchService]

  // -- test obj
  val paypalBackend = new PaypalBackend(
    mockPaypalService,
    mockDatabaseService,
    mockIdentityService,
    mockAcquisitionsEventBusService,
    mockEmailService,
    mockCloudWatchService,
    mockSupporterProductDataService,
    mockSwitchService,
  )(DefaultThreadPool(ec))

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

class PaypalBackendSpec extends AnyWordSpec with Matchers with FutureEitherValues with IntegrationPatience {

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, None)

  "Paypal Backend" when {

    "a request is made to create a payment" should {

      "return Paypal switch not enabled error if paypal switch in support-admin-console is Off" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(
          Currency.GBP,
          BigDecimal(3),
          "return-url/return?email=test.user@gmail.com",
          "cancel-url",
        )
        val switchServiceOffResponse: EitherT[Future, Nothing, Switches] =
          EitherT.right(
            Future.successful(
              Switches(
                Some(RecaptchaSwitches(RecaptchaSwitchTypes(Some(SwitchDetails(On)), Some(SwitchDetails(On))))),
                Some(
                  OneOffPaymentMethodsSwitches(
                    OneOffPaymentMethodsSwitchesTypes(
                      Some(SwitchDetails(On)),
                      Some(SwitchDetails(On)),
                      Some(SwitchDetails(Off)),
                    ),
                  ),
                ),
                Some(FeatureSwitches(FeatureSwitchesTypes(Some(SwitchDetails(On))))),
              ),
            ),
          )

        when(mockSwitchService.allSwitches).thenReturn(switchServiceOffResponse)
        paypalBackend.createPayment(createPaypalPaymentData).futureLeft mustBe PaypalApiError(
          None,
          None,
          "Paypal Switch not enabled",
        )
      }
    }
    "a request is made to create a payment" should {

      "return payment if service returns payment successfully" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(
          Currency.GBP,
          BigDecimal(3),
          "return-url/return?email=test.user@gmail.com",
          "cancel-url",
        )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.createPayment(createPaypalPaymentData)).thenReturn(paymentServiceResponse)
        paypalBackend.createPayment(createPaypalPaymentData).futureRight mustBe paymentMock
      }

      "return error if service fails" in new PaypalBackendFixture {
        val createPaypalPaymentData = CreatePaypalPaymentData(
          Currency.GBP,
          BigDecimal(3),
          "return-url/return?email=test.user@gmail.com",
          "cancel-url",
        )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.createPayment(createPaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.createPayment(createPaypalPaymentData).futureLeft mustBe
          PaypalApiError(None, None, "Error response")
      }

      "return error if email address has a comma " in new PaypalBackendFixture {
        val createPaypalPaymentDataWithInvalidEmail = CreatePaypalPaymentData(
          Currency.GBP,
          BigDecimal(3),
          "https://support.thegulocal.com/uk/paypal/rest/return?email=test,user@gmail.com",
          "cancel-url",
        )
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        paypalBackend.createPayment(createPaypalPaymentDataWithInvalidEmail).futureLeft mustBe
          PaypalApiError(None, None, "Invalid email address")
      }
    }

    "a request is made to execute a payment" should {

      "return error if paypal service fails" in new PaypalBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponseError)
        paypalBackend.executePayment(executePaypalPaymentData, clientBrowserInfo).futureLeft mustBe paymentError

      }

      "return successful payment response even if identityService, " +
        "databaseService and emailService fail" in new PaypalBackendFixture {
          populatePaymentMock()
          val enrichedPaypalPaymentMock =
            EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail), None)
          when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
          when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
          when(mockSupporterProductDataService.insertContributionData(any())(any()))
            .thenReturn(supporterProductDataResponseError)
          when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
            .thenReturn(acquisitionsEventBusResponseError)
          when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
          when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponseError)

          paypalBackend
            .executePayment(executePaypalPaymentData, clientBrowserInfo)
            .futureRight mustBe enrichedPaypalPaymentMock

        }

      "return successful payment response with guestAccountRegistrationToken if available" in new PaypalBackendFixture {
        populatePaymentMock()
        val enrichedPaypalPaymentMock =
          EnrichedPaypalPayment(paymentMock, Some(paymentMock.getPayer.getPayerInfo.getEmail), Some(Current))
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponseError)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponseError)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
        when(mockIdentityService.getOrCreateIdentityIdFromEmail("email@email.com")).thenReturn(identityResponse)

        paypalBackend
          .executePayment(executePaypalPaymentData, clientBrowserInfo)
          .futureRight mustBe enrichedPaypalPaymentMock
      }

      "return error if email address has a comma" in new PaypalBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.executePayment(executePaypalPaymentData)).thenReturn(paymentServiceResponse)
        paypalBackend
          .executePayment(executePaypalPaymentData.copy(email = "john,duff@thegulocal.com"), clientBrowserInfo)
          .futureLeft
          .message mustBe "Invalid email address"

      }

    }

    "a request is made to process a refund hook" should {

      "return error if refund hook is not valid" in new PaypalBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponseError)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureLeft mustBe backendPaymentError
      }

      "return error if databaseService fails" in new PaypalBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponseError)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureLeft mustBe backendDbError
      }

      "return success if refund hook is valid and databaseService succeeds" in new PaypalBackendFixture {
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockPaypalService.validateWebhookEvent(any(), any())).thenReturn(unitPaymentResponse)
        when(mockDatabaseService.flagContributionAsRefunded(any())).thenReturn(databaseResponse)
        paypalBackend.processRefundHook(paypalRefundWebHookData).futureRight mustBe ()
      }
    }

    "tracking the contribution" should {

      "return just a DB error if BigQuery and SupporterProductData succeed but DB fails" in new PaypalBackendFixture {
        populatePaymentMock()
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponseError)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)

        val trackContribution = PrivateMethod[Future[List[BackendError]]](Symbol("trackContribution"))
        val result = paypalBackend invokePrivate trackContribution(
          paymentMock,
          acquisitionData,
          "a@b.com",
          None,
          clientBrowserInfo,
          None,
        )

        result.futureValue mustBe List(BackendError.Database(dbError))

      }

      "return a combined error if stream and BigQuery fail" in new PaypalBackendFixture {
        populatePaymentMock()
        when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
        when(mockDatabaseService.insertContributionData(any())).thenReturn(databaseResponse)
        when(mockSupporterProductDataService.insertContributionData(any())(any()))
          .thenReturn(supporterProductDataResponse)
        when(mockAcquisitionsEventBusService.putAcquisitionEvent(any()))
          .thenReturn(acquisitionsEventBusResponseError)

        val trackContribution = PrivateMethod[Future[List[BackendError]]](Symbol("trackContribution"))
        val errors = List(
          BackendError.AcquisitionsEventBusError(acquisitionsEventBusErrorMessage),
        )
        val result = paypalBackend invokePrivate trackContribution(
          paymentMock,
          acquisitionData,
          "a@b.com",
          None,
          clientBrowserInfo,
          None,
        )
        result.futureValue mustEqual errors

      }

    }
  }
}
