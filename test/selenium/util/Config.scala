package selenium.util

import com.typesafe.config.ConfigFactory
import org.slf4j.LoggerFactory
import scala.util.{Failure, Success, Try}

object Config {

  private def logger = LoggerFactory.getLogger(this.getClass)

  private val conf = ConfigFactory.load()

  val supportFrontendUrl = conf.getString("support.url")

  val identityFrontendUrl = conf.getString("identity.webapp.url")

  val testUsersSecret = conf.getString("identity.test.users.secret")

  val webDriverRemoteUrl = Try(conf.getString("web.driver.remote.url")) match {
    case Success(url) => url
    case Failure(_) => ""
  }

  def printSummary(): Unit = {
    logger.info("Selenium Test Configuration")
    logger.info("=============================")
    logger.info(s"Stage: ${conf.getString("stage")}")
    logger.info(s"Support Frontend: ${supportFrontendUrl}")
    logger.info(s"Identity Frontend: ${identityFrontendUrl}")
    logger.info(s"Screencast = https://saucelabs.com/tests/${Driver.sessionId}")
  }

}