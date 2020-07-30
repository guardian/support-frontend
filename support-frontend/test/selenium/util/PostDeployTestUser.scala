package selenium.util

import java.time.Duration.ofDays

import com.gu.identity.testing.usernames.TestUsernames

import okhttp3.{OkHttpClient, Request, RequestBody, MediaType, Response}
import io.circe.{Json, HCursor, Decoder}
import io.circe.parser.parse

trait TestUser {
  val username: String
}

class PostDeployTestUser(driverConfig: DriverConfig) extends TestUser {

  private val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(Config.testUsersSecret),
    recency = ofDays(2)
  )
  private val client = new OkHttpClient()
  private val requestToIdapi = new Request.Builder()
    .url(Config.idapiNewTestUserUrl)
    .addHeader(Config.idapiClientAccessTokenName, Config.idapiClientAccessTokenSecret)
    .post(RequestBody.create(MediaType.parse("application/json"), "{}"))
    .build()
  private val response = client.newCall(requestToIdapi).execute()
  private val responseBodyAsJson = parse(response.body().string()).getOrElse(Json.Null)
  private val cursor = responseBodyAsJson.hcursor

  private def addTestUserCookies(testUsername: String) = {
    driverConfig.addCookie(name = "pre-signin-test-user", value = testUsername)
    driverConfig.addCookie(name = "_test_username", value = testUsername, domain = Some(Config.guardianDomain))
    driverConfig.addCookie(name = "_post_deploy_user", value = "true") // This enables the tests to use the mocked payment services
    for (n <- 0 until 3) {
      val cookie_name = cursor.downField("values").downN(n).downField("key").as[String].right.get
      val cookie_value = cursor.downField("values").downN(n).downField("value").as[String].right.get
      driverConfig.addCookie(name = cookie_name, value = cookie_value)
    }
  }

  val username = testUsers.generate()
  addTestUserCookies(username)
}
