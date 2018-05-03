package services

import cats.data.EitherT
import com.gu.identity.play.{IdMinimalUser, IdUser, PrivateFields, PublicFields}
import monitoring.SafeLogger
import play.api.mvc.RequestHeader
import cats.implicits._

import scala.concurrent.{ExecutionContext, Future}

class StubIdentityService extends IdentityServiceOrStub {
  def getUser(user: IdMinimalUser)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, IdUser] = {
    val privateFields = PrivateFields(firstName = Some("Frosty"), secondName = Some("The Snowman"))
    val stubTestUser = IdUser("123456", "fakeemail@gu.com", PublicFields(None), Some(privateFields), None)

    SafeLogger.info(s"Stubbed identity service active. Returning test names $privateFields")

    EitherT.right(Future.successful(stubTestUser)).ensure("nonsense")(id => true) //always return the iduser todo: how to actually do this properly
  }

  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {
    SafeLogger.info("Stubbed identity service active. Returning true (Successful response from Identity Consent API) ")
    Future.successful(true)
  }
}
