package lib

import java.time.Duration.ofDays

import com.gu.identity.testing.usernames.TestUsernames

class TestUsers(secret: String) {

  val ValidityPeriod = ofDays(2)

  lazy val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(secret),
    recency = ValidityPeriod
  )

  def isTestUser(displayName: Option[String]): Boolean =
    displayName.flatMap(_.split(' ').headOption).exists(testUsers.isValid)
}
