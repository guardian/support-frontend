package services

import java.time.Duration.ofDays

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.testing.usernames.TestUsernames

object TestUserService {
  def apply(secret: String): TestUserService = new TestUserService(secret)
}
class TestUserService(secret: String) {

  val ValidityPeriod = ofDays(2)

  lazy val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(secret),
    recency = ValidityPeriod
  )

  def isTestUser[A](request: CustomActionBuilders.OptionalAuthRequest[_]): Boolean = {
    val userName = request.user.map(user => user.user.displayName).getOrElse(request.cookies.get("_test_username").map(_.value))
    isTestUser(userName)
  }

  def isTestUser(displayName: Option[String]): Boolean =
    displayName.flatMap(_.split(' ').headOption).exists(testUsers.isValid)

  def isTestUser(user: AuthenticatedIdUser): Boolean = isTestUser(user.displayName)
}
