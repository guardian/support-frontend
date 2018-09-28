package services

import cats.data.EitherT
import cats.implicits._
import com.gu.identity.play.{IdMinimalUser, IdUser, PrivateFields, PublicFields}
import models.identity.{CookiesResponse, UserIdWithGuestAccountToken}
import monitoring.SafeLogger
import play.api.mvc.RequestHeader
import org.joda.time.DateTime

import scala.concurrent.{ExecutionContext, Future}

class StubIdentityService extends IdentityService {
  def getUser(user: IdMinimalUser)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, IdUser] = {
    val privateFields = PrivateFields(firstName = Some("Frosty"), secondName = Some("The Snowman"))
    val stubTestUser: IdUser = IdUser("123456", "nonsense@gu.com", PublicFields(None), Some(privateFields), None)

    SafeLogger.info(s"Stubbed identity service active. Returning test names $privateFields")
    EitherT.rightT[Future, String](stubTestUser)
  }

  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {
    SafeLogger.info("Stubbed identity service active. Returning true (Successful response from Identity Consent API) ")
    Future.successful(true)
  }

  def setPasswordGuest(
    password: String,
    guestAccountRegistrationToken: String
  )(implicit ec: ExecutionContext): EitherT[Future, String, CookiesResponse] = {
    SafeLogger.info("Stubbed identity service active. Returning true (Successful response from Identity Consent API) ")
    EitherT.rightT[Future, String](CookiesResponse(DateTime.now(), List.empty))
  }

  def getOrCreateUserIdFromEmail(email: String)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, UserIdWithGuestAccountToken] = {
    EitherT.rightT[Future, String](UserIdWithGuestAccountToken("123456", None))
  }
}
