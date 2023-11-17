package backend

import cats.data.EitherT
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.gu.support.config.Stage
import com.gu.support.config.Stages.DEV
import org.scalatest.time.{Millis, Span}
import conf.{AmazonPayConfig, ConfigLoaderProvider}
import model._
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError, AmazonPaymentData}
import org.mockito.Mockito.when
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar
import services.SwitchState.On
import services.{
  AmazonPayService,
  CloudWatchService,
  ContributionsStoreService,
  EmailService,
  FeatureSwitches,
  FeatureSwitchesTypes,
  IdentityService,
  OneOffPaymentMethodsSwitches,
  OneOffPaymentMethodsSwitchesTypes,
  RecaptchaSwitchTypes,
  RecaptchaSwitches,
  SoftOptInsService,
  SupporterProductDataService,
  SwitchDetails,
  SwitchService,
  Switches,
}
import util.FutureEitherValues

import scala.concurrent.Future

/** This test was written to debug why we were getting XML marshalling errors when upgrading to Java 11. See the PR for
  * more detials: https://github.com/guardian/support-frontend/pull/5350
  *
  * We have kept it in case we need something similar in the future.
  *
  * The test assumes your stage is DEV or skips.
  */
class AmazonPayBackendIntegrationSpec
    extends AsyncFlatSpec
    with Matchers
    with FutureEitherValues
    with MockitoSugar
    with ConfigLoaderProvider {

  private val stage = Stage.fromString(sys.env.getOrElse("STAGE", "DEV")).getOrElse(DEV)

  lazy val config: AmazonPayConfig = configForTestEnvironment[AmazonPayConfig]()
  val amazonPayService = new AmazonPayService(config)(DefaultThreadPool(executionContext))

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
          Some(FeatureSwitches(FeatureSwitchesTypes(SwitchDetails(On)))),
        ),
      ),
    )

  override implicit val patienceConfig: PatienceConfig =
    PatienceConfig(timeout = Span(10000, Millis), interval = Span(20, Millis))

  // -- service mocks
  val mockDatabaseService: ContributionsStoreService = mock[ContributionsStoreService]
  val mockIdentityService: IdentityService = mock[IdentityService]
  val mockAcquisitionsEventBusService: AcquisitionsEventBusService = mock[AcquisitionsEventBusService]
  val mockEmailService: EmailService = mock[EmailService]
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]
  val mockSupporterProductDataService: SupporterProductDataService = mock[SupporterProductDataService]
  val mockSoftOptInsService: SoftOptInsService = mock[SoftOptInsService]
  val mockSwitchService: SwitchService = mock[SwitchService]

  // -- test obj
  val amazonPayBackend = new AmazonPayBackend(
    mockCloudWatchService,
    amazonPayService,
    mockIdentityService,
    mockEmailService,
    mockAcquisitionsEventBusService,
    mockDatabaseService,
    mockSupporterProductDataService,
    mockSoftOptInsService,
    mockSwitchService,
  )(DefaultThreadPool(executionContext))

  val paymentdata = AmazonPaymentData("refId", BigDecimal(25), Currency.USD, "email@thegulocal.com")
  val amazonPayRequest = AmazonPayRequest(paymentdata, None)
  val clientBrowserInfo = ClientBrowserInfo("", "", None, None, None)
  val paymentError = AmazonPayApiError.fromString("Error response")

  "AmazonPayBackend.makePayment" should "not returning an XML marshalling error" in {
    // We only ever run this test locally for debugging.
    // We shouldn't run this in CI as it actually calls out to the AmazonPay API
    assume(stage == DEV)

    when(mockSwitchService.allSwitches).thenReturn(switchServiceOnResponse)
    amazonPayBackend
      .makePayment(amazonPayRequest, clientBrowserInfo)
      .fold(
        err => {
          err.message mustNot startWith("Encountered marshalling error while marshalling data")
        },
        _ => {
          fail("AmazonPayBackend should not succeed")
        },
      )
  }
}
