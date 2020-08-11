package selenium.util

import java.time.Duration.ofDays

import com.gu.identity.testing.usernames.TestUsernames

import okhttp3.{OkHttpClient, Request, RequestBody, MediaType, Response}
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{Json, Decoder, DecodingFailure}
import io.circe.parser.parse

import org.slf4j.LoggerFactory

trait TestUser {
  val username: String
}

class PostDeployTestUserContribs(driverConfig: DriverConfig) extends TestUser {

  private val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(Config.testUsersSecret),
    recency = ofDays(2)
  )

  private def addTestUserCookies(testUsername: String) = {
    driverConfig.addCookie(name = "pre-signin-test-user", value = testUsername)
    driverConfig.addCookie(name = "_test_username", value = testUsername, domain = Some(Config.guardianDomain))
    driverConfig.addCookie(name = "_post_deploy_user", value = "true") // This enables the tests to use the mocked payment services
  }

  val username = testUsers.generate()
  addTestUserCookies(username)
}

class PostDeployTestUserSubs(driverConfig: DriverConfig) extends TestUser {

  private def addTestUserCookies(testUsername: String) = {
    driverConfig.addCookie(name = "pre-signin-test-user", value = testUsername)
    driverConfig.addCookie(name = "_test_username", value = testUsername, domain = Some(Config.guardianDomain))
    driverConfig.addCookie(name = "_post_deploy_user", value = "true") // This enables the tests to use the mocked payment services
    driverConfig.addCookie(name = "GU_TK", value = "1.1") //To avoid consent banner, which messes with selenium
    IdapiRequest.decodeCookies.foreach { cookie =>
      driverConfig.addCookie(name = cookie.key, value = cookie.value)
    }
  }

  val username = "postDeployTestUser"
  addTestUserCookies(username)
}

case class IdapiCookie(key: String, value: String)

object IdapiCookie {
  implicit val decoder: Decoder[IdapiCookie] = deriveDecoder[IdapiCookie]
}

case class IdapiSuccessfulResponse(values: List[IdapiCookie])

object IdapiSuccessfulResponse {
  implicit val decoder: Decoder[IdapiSuccessfulResponse] = deriveDecoder[IdapiSuccessfulResponse]
}

object IdapiRequest {

  private val client = new OkHttpClient()

  private def logger = LoggerFactory.getLogger(this.getClass)

  private val request: Request = new Request.Builder()
    .url(Config.idapiNewTestUserUrl)
    .addHeader(Config.idapiClientAccessTokenName, Config.idapiClientAccessTokenSecret)
    .post(RequestBody.create(MediaType.parse("application/json"), "{}"))
    .build()

  private def getResult: Json = {
    val response: Response = client.newCall(request).execute()
    parse(response.body().string()).getOrElse(Json.Null)
  }

  def decodeCookies: List[IdapiCookie] = {
    val responseDecoded: Either[DecodingFailure, IdapiSuccessfulResponse] = getResult.as[IdapiSuccessfulResponse]
    var cookies = List[IdapiCookie]()
    responseDecoded match {
      case Left(l) => logger.error(s"Failed to decode IDAPI response: ${l}")
      case Right(r) => cookies = r.values
    }
    cookies
  }
}
