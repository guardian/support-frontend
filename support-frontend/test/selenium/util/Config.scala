package selenium.util

import com.typesafe.config.ConfigFactory
import org.openqa.selenium.remote.SessionId
import org.slf4j.LoggerFactory

import java.time.Duration
import scala.util.{Failure, Success, Try}

object Config {

  private def logger = LoggerFactory.getLogger(this.getClass)

  private val conf = ConfigFactory.load()

  val supportFrontendUrl = conf.getString("support.url")

  val waitTimeout = Duration.ofSeconds(45)

  val identityGatewayUrl = conf.getString("identity.webapp.url")

  val testUsersSecret = conf.getString("identity.test.users.secret")

  val testUserEmailAddress = conf.getString("identity.test.user.email")

  val testUserPassword = conf.getString("identity.test.user.password")

  val idapiNewTestUserUrl = conf.getString("idapi.newTestUser.url")

  val idapiClientAccessTokenName = conf.getString("idapi.clientAccessToken.name")

  val idapiClientAccessTokenSecret = conf.getString("idapi.clientAccessToken.secret")

  val webDriverRemoteUrl = Try(conf.getString("web.driver.remote.url")) match {
    case Success(url) => url
    case Failure(_) => ""
  }

  def printSummary(sessionId: SessionId): Unit = {
    logger.info("Selenium Test Configuration")
    logger.info("=============================")
    logger.info(s"Stage: ${conf.getString("stage")}")
    logger.info(s"Support Frontend: ${supportFrontendUrl}")
  }

}
