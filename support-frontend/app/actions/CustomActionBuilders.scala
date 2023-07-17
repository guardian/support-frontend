package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import admin.settings.FeatureSwitches
import akka.stream.scaladsl.Flow
import akka.util.ByteString
import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.config.Stage
import models.identity.responses.IdentityErrorResponse._
import play.api.libs.streams.Accumulator
import play.api.mvc._
import play.filters.csrf._
import services.AsyncAuthenticationService
import utils.FastlyGEOIP

import scala.concurrent.{ExecutionContext, Future}

class CustomActionBuilders(
    val asyncAuthenticationService: AsyncAuthenticationService,
    userFromAuthCookiesOrAuthServerActionBuilder: UserFromAuthCookiesOrAuthServerActionBuilder,
    userFromAuthCookiesActionBuilder: UserFromAuthCookiesActionBuilder,
    cc: ControllerComponents,
    addToken: CSRFAddToken,
    checkToken: CSRFCheck,
    csrfConfig: CSRFConfig,
    stage: Stage,
    featureSwitches: => FeatureSwitches,
)(implicit private val ec: ExecutionContext) {

  val PrivateAction =
    new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  /** This is the action builder that should be used for all actions requiring authentication that are triggered by a
    * page load.
    *
    * The difference between this builder and [[MaybeAuthenticatedActionOnFormSubmission]] is that this builder will
    * redirect to the auth server to find auth tokens if there are no cookies present containing them.
    */
  def MaybeAuthenticatedAction: ActionBuilder[OptionalAuthRequest, AnyContent] =
    chooseActionBuilder(userFromAuthCookiesOrAuthServerActionBuilder)

  /** This is the action builder that should be used for all actions requiring authentication that are triggered by a
    * form submission.
    *
    * The difference between this builder and [[MaybeAuthenticatedAction]] is that this builder will not redirect to the
    * auth server. It just checks for the presence of cookies containing auth tokens.
    */
  def MaybeAuthenticatedActionOnFormSubmission: ActionBuilder[OptionalAuthRequest, AnyContent] =
    chooseActionBuilder(userFromAuthCookiesActionBuilder)

  private def chooseActionBuilder(
      oktaAuthBuilder: ActionBuilder[OptionalAuthRequest, AnyContent],
  ): ActionBuilder[OptionalAuthRequest, AnyContent] =
    PrivateAction andThen (
      if (featureSwitches.authenticateWithOkta.isOn)
        oktaAuthBuilder
      else
        new AsyncAuthenticatedBuilder(asyncAuthenticationService.tryAuthenticateUser, cc.parsers.defaultBodyParser)
    )

  case class LoggingAndAlarmOnFailure[A](chainedAction: Action[A]) extends EssentialAction {

    private def pushAlarmMetric = {
      val cloudwatchEvent = AwsCloudWatchMetricSetup.serverSideCreateFailure(stage)
      AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
    }

    private def maybePushAlarmMetric(result: Result) =
      if (
        result.header.status.toString.head != '2' && !result.header.reasonPhrase.contains(
          emailProviderRejectedCode,
        ) && !result.header.reasonPhrase.contains(
          invalidEmailAddressCode,
        )
      ) {
        SafeLogger.error(scrub"pushing alarm metric - non 2xx response ${result.toString()}")
        pushAlarmMetric
      }

    def apply(requestHeader: RequestHeader): Accumulator[ByteString, Result] = {
      val accumulator = chainedAction.apply(requestHeader)
      val loggedAccumulator = accumulator.through(Flow.fromFunction { (byteString: ByteString) =>
        SafeLogger.info("incoming POST: " + byteString.utf8String)
        byteString
      })
      loggedAccumulator
        .map { result =>
          maybePushAlarmMetric(result)
          result
        }
        .recoverWith({ case throwable: Throwable =>
          SafeLogger.error(scrub"pushing alarm metric - 5xx response caused by ${throwable}")
          pushAlarmMetric
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
