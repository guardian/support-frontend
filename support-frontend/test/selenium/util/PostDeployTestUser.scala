package selenium.util

import java.time.Duration.ofDays

import com.gu.identity.testing.usernames.TestUsernames

trait TestUser {
  val username: String
}

class PostDeployTestUser(driverConfig: DriverConfig, bypassRecaptchaCookies: Option[List[IdapiCookie]] = None)
    extends TestUser {

  private val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(Config.testUsersSecret),
    recency = ofDays(2),
  )

  private def addTestUserCookies(testUsername: String) = {
    driverConfig.addCookie(name = "pre-signin-test-user", value = testUsername)
    driverConfig.addCookie(name = "_test_username", value = testUsername)
    driverConfig.addCookie(
      name = "_post_deploy_user",
      value = "true",
    ) // This enables the tests to use the mocked payment services
    driverConfig.addCookie(name = "GU_TK", value = "1.1") // To avoid consent banner, which messes with selenium
    bypassRecaptchaCookies.toList.flatten.foreach { cookie =>
      driverConfig.addCookie(name = cookie.key, value = cookie.value)
    }
  }

  val username = testUsers.generate()
  addTestUserCookies(username)
}
