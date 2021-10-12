package actions

import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.config.Stage
import config.Configuration.IdentityUrl
import io.lemonlabs.uri.typesafe.dsl._
import play.api.mvc.Results._
import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._
import play.filters.csrf._
import services.{AsyncAuthenticationService, AuthenticatedIdUser}
import utils.FastlyGEOIP

import scala.concurrent.{ExecutionContext, Future}

object CustomActionBuilders {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
  type OptionalAuthRequest[A] = AuthenticatedRequest[A, Option[AuthenticatedIdUser]]
  type AnyAuthRequest[A] = AuthenticatedRequest[A, _]
}

class CustomActionBuilders(
  asyncAuthenticationService: AsyncAuthenticationService,
  idWebAppUrl: IdentityUrl,
  supportUrl: String,
  cc: ControllerComponents,
  addToken: CSRFAddToken,
  checkToken: CSRFCheck,
  csrfConfig: CSRFConfig,
  stage: Stage
)(implicit private val ec: ExecutionContext) {

  import CustomActionBuilders._

  val membersIdentityClientId = "members"
  val subscriptionsClientId = "subscriptions"
  val recurringIdentityClientId = "recurringContributions"

  // Tells identity to send users back to the checkout immediately after sign-up.
  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"
  // Prevents the identity validation email sending users back to our checkout.
  private val idSkipValidationReturn: (String, String) = "skipValidationReturn" -> "true"

  private def idWebAppRegisterUrl(path: String, clientId: String): String =
    (idWebAppUrl.value / "signin" ?
      ("returnUrl" -> s"$supportUrl$path") &
      idSkipConfirmation &
      idSkipValidationReturn &
      "clientId" -> clientId &
      "componentEventParams" -> "componentType=identityauthentication&componentId=signin_redirect_for_supporters").toString

  def onUnauthenticated(identityClientId: String): RequestHeader => Result = request => {
    SeeOther(idWebAppRegisterUrl(request.uri, identityClientId))
  }

  private def maybeAuthenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[OptionalAuthRequest, AnyContent] =
    new AsyncAuthenticatedBuilder(
      asyncAuthenticationService.tryAuthenticateUser,
      cc.parsers.defaultBodyParser,
      onUnauthenticated
    )

  private def authenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AsyncAuthenticatedBuilder(asyncAuthenticationService.authenticateUser, cc.parsers.defaultBodyParser, onUnauthenticated)

  val PrivateAction = new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  def authenticatedAction(identityClientId: String = membersIdentityClientId): ActionBuilder[AuthRequest, AnyContent] = {
    PrivateAction andThen authenticated(onUnauthenticated(identityClientId))
  }

  def maybeAuthenticatedAction(identityClientId: String = membersIdentityClientId): ActionBuilder[OptionalAuthRequest, AnyContent] =
    PrivateAction andThen maybeAuthenticated(onUnauthenticated(identityClientId))

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
