package wiring

import controllers.AssetsComponents
import filters.{CacheHeadersCheck, RelaxReferrerPolicyFromRedirectFilter, SetCookiesCheck}
import lib.{CustomHttpErrorHandler, ErrorController}
import monitoring.{SentryLogging, StateMachineMonitor}
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.filters.HttpFiltersComponents
import play.filters.cors.CORSComponents
import play.filters.csp.CSPComponents
import play.filters.gzip.GzipFilter
import com.gu.play.secretrotation.{RotatingSecretComponents, SnapshotProvider, TransitionTiming}
import com.gu.play.secretrotation.aws.parameterstore.{AwsSdkV2, SecretSupplier}
import software.amazon.awssdk.services.ssm.SsmClient
import java.time.Duration.{ofHours, ofMinutes}
import com.gu.aws.CredentialsProvider
import software.amazon.awssdk.regions.Region

class AppComponents(context: Context, stage: String)
    extends BuiltInComponentsFromContext(context)
    with PlayComponents
    with AhcWSComponents
    with AssetsComponents
    with Controllers
    with Services
    with ApplicationConfiguration
    with ActionBuilders
    with Assets
    with GoogleAuth
    with CORSComponents
    with CSPComponents
    with HttpFiltersComponents
    with RotatingSecretComponents {

  private lazy val customHandler: CustomHttpErrorHandler = new CustomHttpErrorHandler(
    environment,
    configuration,
    devContext.map(_.sourceMapper),
    Some(router),
    assetsResolver,
    allSettingsProvider,
  )
  override lazy val httpErrorHandler = customHandler
  override lazy val errorController = new ErrorController(actionBuilders, customHandler)

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    // This filter needs to be before the `securityHeadersFilter` as it removes a header set by that filter
    new RelaxReferrerPolicyFromRedirectFilter(),
    cspFilter,
    corsFilter,
    new SetCookiesCheck(),
    securityHeadersFilter,
    new CacheHeadersCheck(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images")),
  )

  override lazy val router: Router = new _root_.router.Routes(
    httpErrorHandler,
    applicationController,
    errorController,
    diagnosticsController,
    siteMapController,
    createSubscriptionController,
    supportWorkersStatusController,
    stripeController,
    identityController,
    invitationController,
    subscriptionsController,
    weeklyController,
    paperController,
    getAddressController,
    paperRoundController,
    loginController,
    testUsersController,
    authCodeFlowController,
    payPalOneOffController,
    payPalCompletePaymentsController,
    payPalRegularController,
    directDebitController,
    promotionsController,
    analyticsController,
    newspaperArchiveController,
    assetController,
    faviconController,
  )

  SentryLogging.init(appConfig)
  new StateMachineMonitor(supportWorkersClient, actorSystem).start()

  // Force the creation of cachedTaxRateService on startup so that it can pre-fetch the tax rates and populate the
  // cache. This avoids a race condition when the first request arrives before the initial fetch completes.
  val _ = cachedSalesTaxService

  // Force the creation of both cachedPromotionsServiceProvider variants (default + test-user) on startup, same
  // reasoning as above.
  val _ = (cachedPromotionsServiceProvider.forUser(false), cachedPromotionsServiceProvider.forUser(true))

  lazy val secretStateSupplier: SnapshotProvider = {
    import com.gu.play.secretrotation.aws.parameterstore

    new parameterstore.SecretSupplier(
      TransitionTiming(usageDelay = ofMinutes(3), overlapDuration = ofHours(2)),
      s"/support/frontend/$stage/play.http.secret.key",
      AwsSdkV2(
        SsmClient
          .builder()
          .credentialsProvider(CredentialsProvider)
          .region(Region.EU_WEST_1)
          .build(),
      ),
    )
  }
}
