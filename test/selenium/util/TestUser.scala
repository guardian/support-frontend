package selenium.util

import java.time.Duration.ofDays

import com.gu.identity.testing.usernames.TestUsernames

class TestUser {

  private val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(Config.testUsersSecret),
    recency = ofDays(2)
  )

  private def addTestUserCookies(testUsername: String) = {
    Driver.addCookie(name = "pre-signin-test-user", value = testUsername)
    Driver.addCookie(name = "_test_username", value = testUsername, domain = Some(Config.guardianDomain))
  }

  val username = testUsers.generate()
  addTestUserCookies(username)
}
