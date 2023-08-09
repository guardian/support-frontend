package services

import com.gu.identity.auth.IdentityClient.Error
import com.gu.identity.auth.{IdapiAuthConfig, IdentityClient}
import com.gu.identity.model.User
import com.gu.identity.play.IdapiPlayAuthService
import com.gu.identity.play.IdapiPlayAuthService.UserCredentialsMissingError
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import config.Identity
import org.http4s.Uri
import play.api.http.ContentTypes.FORM
import play.api.http.HeaderNames.CONTENT_TYPE
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}

class AsyncAuthenticationService(identityPlayAuthService: IdapiPlayAuthService, ws: WSClient, config: Identity)(implicit
    ec: ExecutionContext,
) {

  def tryAuthenticateUser(requestHeader: RequestHeader): Future[Option[User]] =
    identityPlayAuthService
      .getUserFromRequestUsingSCGUUCookie(requestHeader)
      .map { case (_, user) => user }
      .unsafeToFuture()
      .map(user => Some(user))
      .recover {
        case _: UserCredentialsMissingError =>
          // user not signed in https://github.com/guardian/identity/pull/1578
          None
        case IdentityClient.Errors(List(Error("Access Denied"))) =>
          // scalastyle:off
          // invalid SC_GU_U cookie?
          // https://github.com/guardian/identity/blob/424b5170f1b892778fe94f9b3d9a540fb5181e9d/identity-model/src/main/scala/com/gu/identity/model/Errors.scala#L60
          // scalastyle:on
          None
        case err =>
          // something else went wrong - we should alert on this
          SafeLogger.error(scrub"unable to authorize user", err)
          None
      }

  // See AuthCodeFlowController.callback
  def getTokens(requestBody: String): Future[WSResponse] =
    ws.url(config.oauthTokenUrl)
      .addHttpHeaders(CONTENT_TYPE -> FORM)
      .post(requestBody)

  /** eventually true iff auth server is available for requests */
  def isAuthServerUp(): Future[Boolean] =
    ws.url(config.oauthAuthorizeUrl)
      .head()
      .map(_.status < 500)
      .recover { case _ => false }
}

object AsyncAuthenticationService {

  case class IdentityIdAndEmail(id: String, primaryEmailAddress: String)

  def apply(config: Identity, ws: WSClient)(implicit ec: ExecutionContext): AsyncAuthenticationService = {
    val apiUrl = Uri.unsafeFromString(config.apiUrl)
    val identityPlayAuthService =
      IdapiPlayAuthService.unsafeInit(IdapiAuthConfig(identityApiUri = apiUrl, accessToken = config.apiClientToken))
    new AsyncAuthenticationService(identityPlayAuthService, ws, config)
  }

}
