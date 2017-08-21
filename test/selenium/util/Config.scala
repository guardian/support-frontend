package selenium.util

import com.typesafe.config.ConfigFactory
import org.slf4j.LoggerFactory

object Config {

  private def logger = LoggerFactory.getLogger(this.getClass)

  private val conf = ConfigFactory.load()

  val supportFrontendUrl = conf.getString("support.url")

  val identityFrontendUrl = conf.getString("identity.webapp.url")

  val testUsersSecret = conf.getString("identity.test.users.secret")

  val waitTimeout = conf.getInt("selenium.wait.timeout")

}