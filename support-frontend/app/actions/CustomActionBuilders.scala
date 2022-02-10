package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import akka.stream.scaladsl.Flow
import akka.util.ByteString
import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.identity.model.User
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.config.Stage
import play.api.libs.streams.Accumulator
import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._
import play.filters.csrf._
import services.AsyncAuthenticationService
import utils.FastlyGEOIP

import scala.concurrent.{ExecutionContext, Future}

class CustomActionBuilders(
    val asyncAuthenticationService: AsyncAuthenticationService,
    cc: ControllerComponents,
    addToken: CSRFAddToken,
    checkToken: CSRFCheck,
    csrfConfig: CSRFConfig,
    stage: Stage,
)(implicit private val ec: ExecutionContext) {

  val PrivateAction =
    new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  val MaybeAuthenticatedAction: ActionBuilder[OptionalAuthRequest, AnyContent] =
    PrivateAction andThen new AsyncAuthenticatedBuilder(
      asyncAuthenticationService.tryAuthenticateUser,
      cc.parsers.defaultBodyParser,
    )

  case class LoggingAndAlarmOnFailure[A](chainedAction: Action[A]) extends EssentialAction {

    def apply(requestHeader: RequestHeader): Accumulator[ByteString, Result] = {
      val accumulator = chainedAction.apply(requestHeader)
      val loggedAccumulator = accumulator.through(Flow.fromFunction { (byteString: ByteString) =>
        SafeLogger.info("incoming POST: " + byteString.utf8String)
        byteString
      })
      loggedAccumulator
        .map { result =>
          if (result.header.status.toString.head != '2') {
            SafeLogger.error(scrub"pushing alarm metric - non 2xx response ${result.toString()}")
            val cloudwatchEvent = AwsCloudWatchMetricSetup.serverSideCreateFailure(stage)
            AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
            result
          } else {
            result
          }
        }
        .recoverWith({ case throwable: Throwable =>
          SafeLogger.error(scrub"pushing alarm metric - 5xx response caused by ${throwable}")
          val cloudwatchEvent = AwsCloudWatchMetricSetup.serverSideCreateFailure(stage)
          AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
          Future.failed(throwable)
        })
    }

  }

  val CachedAction = new CachedAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val NoCacheAction = new NoCacheAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val GeoTargetedCachedAction = new CachedAction(
    cc.parsers.defaultBodyParser,
    cc.executionContext,
    List("Vary" -> FastlyGEOIP.fastlyCountryHeader),
  )

}
