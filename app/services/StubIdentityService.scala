package services

import cats.data.EitherT
import com.gu.identity.play.{IdMinimalUser, IdUser, PrivateFields, PublicFields}
import monitoring.SafeLogger
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}

class StubIdentityService extends IdentityService {
  def getUser(user: IdMinimalUser)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, IdUser] = {
    val privateFields = PrivateFields(firstName = Some("Frosty"), secondName = Some("The Snowman"))
    val stubTestUser: IdUser = IdUser("123456", "nonsense@gu.com", PublicFields(None), Some(privateFields), None)

    SafeLogger.info(s"Stubbed identity service active. Returning test names $privateFields")
    EitherT(Future.successful(Either.cond(true, stubTestUser, "This stub should always give a right")))
  }

  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {
    SafeLogger.info("Stubbed identity service active. Returning true (Successful response from Identity Consent API) ")
    Future.successful(true)
  }
}
