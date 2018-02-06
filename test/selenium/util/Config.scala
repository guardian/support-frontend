package selenium.util

import com.typesafe.config.ConfigFactory
import org.openqa.selenium.remote.SessionId
import org.slf4j.LoggerFactory
import scala.util.{Failure, Success, Try}

object Config {

  private def logger = LoggerFactory.getLogger(this.getClass)

  private val conf = ConfigFactory.load()

  val guardianDomain = conf.getString("guardianDomain")

  val supportFrontendUrl = conf.getString("support.url")

  val identityFrontendUrl = conf.getString("identity.webapp.url")

  val contributionFrontend = conf.getString("contribution.url")

  val waitTimeout = 45

  val paypalSandbox = conf.getString("paypal.sandbox.url")

  val testUsersSecret = conf.getString("identity.test.users.secret")

  val webDriverRemoteUrl = Try(conf.getString("web.driver.remote.url")) match {
    case Success(url) => url
    case Failure(_) => ""
  }

  val paypalBuyerEmail = conf.getString("paypal.sandbox.buyer.email")

  val paypalBuyerPassword = conf.getString("paypal.sandbox.buyer.password")

  def printSummary(sessionId: SessionId): Unit = {
    logger.info("Selenium Test Configuration")
    logger.info("=============================")
    logger.info(s"Stage: ${conf.getString("stage")}")
    logger.info(s"Support Frontend: ${supportFrontendUrl}")
    logger.info(s"Identity Frontend: ${identityFrontendUrl}")
    logger.info(s"Screencast = https://saucelabs.com/tests/${sessionId.toString}")
  }

}