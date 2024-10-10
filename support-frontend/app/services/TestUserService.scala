package services

import java.time.Duration.ofDays
import actions.CustomActionBuilders
import com.gu.identity.testing.usernames.TestUsernames
import play.api.mvc.RequestHeader
import java.time.Duration

object TestUserService {
  def apply(secret: String): TestUserService = new TestUserService(secret)
}
class TestUserService(secret: String) {

  val ValidityPeriod: Duration = ofDays(2)

  lazy val testUsers: TestUsernames = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(secret),
    recency = ValidityPeriod,
  )

  def isTestUser[A](request: RequestHeader): Boolean = {
    val userName = request.cookies.get("_test_username").map(_.value)
    isTestUser(userName)
  }

  def isTestUser(testUserName: Option[String]): Boolean =
    testUserName match {
      case Some("SupportPostDeployTestF") => true
      case _ => testUserName.flatMap(_.split(' ').headOption).exists(testUsers.isValid)
    }
}
