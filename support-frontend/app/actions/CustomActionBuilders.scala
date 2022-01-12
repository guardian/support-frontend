package actions

import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.identity.model.User
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.config.Stage
import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._
import play.filters.csrf._
import services.AsyncAuthenticationService
import utils.FastlyGEOIP

import scala.concurrent.{ExecutionContext, Future}

object CustomActionBuilders {
  type OptionalAuthRequest[A] = AuthenticatedRequest[A, Option[User]]
}

class CustomActionBuilders(
  val asyncAuthenticationService: AsyncAuthenticationService,
  cc: ControllerComponents,
  addToken: CSRFAddToken,
  checkToken: CSRFCheck,
  csrfConfig: CSRFConfig,
  stage: Stage
)(implicit private val ec: ExecutionContext) {

  import CustomActionBuilders._

  private val maybeAuthenticated =
    new AsyncAuthenticatedBuilder(
      asyncAuthenticationService.tryAuthenticateUser,
      cc.parsers.defaultBodyParser
    )

  val PrivateAction = new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  def maybeAuthenticatedAction(): ActionBuilder[OptionalAuthRequest, AnyContent] =
    PrivateAction andThen maybeAuthenticated

  def alarmOnFailure[A](action: Action[A]): EssentialAction =
    (v1: RequestHeader) => action.apply(v1).map { result =>
      if (result.header.status.toString.head != '2') {
        SafeLogger.error(scrub"pushing alarm metric - non 2xx response ${result.toString()}")
        val cloudwatchEvent = AwsCloudWatchMetricSetup.serverSideCreateFailure(stage)
        AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
        result
      } else {
        result
      }
    }.recoverWith({ case throwable: Throwable =>
      SafeLogger.error(scrub"pushing alarm metric - 5xx response caused by ${throwable}")
      val cloudwatchEvent = AwsCloudWatchMetricSetup.serverSideCreateFailure(stage)
      AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
      Future.failed(throwable)
    })

  val CachedAction = new CachedAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val NoCacheAction = new NoCacheAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val GeoTargetedCachedAction = new CachedAction(
    cc.parsers.defaultBodyParser,
    cc.executionContext,
    List("Vary" -> FastlyGEOIP.fastlyCountryHeader)
  )

}
