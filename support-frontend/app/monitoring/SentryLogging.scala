package monitoring

import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.filter.ThresholdFilter
import com.gu.monitoring.SafeLogging
import config.Configuration
import io.sentry.Sentry
import io.sentry.logback.SentryAppender
import monitoring.SentryFilters._
import org.slf4j.Logger.ROOT_LOGGER_NAME
import org.slf4j.LoggerFactory

import scala.util.{Failure, Success, Try}

object SentryLogging extends SafeLogging {
  def init(config: Configuration): Unit = {
    config.sentryDsn match {
      case None => logger.warn("No Sentry logging configured (OK for dev)")
      case Some(sentryDSN) =>
        logger.info(s"Initialising Sentry logging")
        Try {
          Sentry.init(sentryDSN)
          val sentryAppender = new SentryAppender {
            addFilter(errorLevelFilter)
            addFilter(piiFilter)
          }

          sentryAppender.start()

          val buildInfo: Map[String, String] = app.BuildInfo.toMap.view.mapValues(_.toString).toMap
          val tags = Map("stage" -> config.stage.toString) ++ buildInfo
          tags.foreach { case (key, value) => Sentry.setTag(key, value) }

          LoggerFactory.getLogger(ROOT_LOGGER_NAME).asInstanceOf[Logger].addAppender(sentryAppender)
        } match {
          case Success(_) => logger.debug("Sentry logging configured.")
          case Failure(e) =>
            logger.error(scrub"Something went wrong when setting up Sentry logging ${e.getStackTrace}")
        }
    }
  }
}

object SentryFilters {

  val errorLevelFilter = new ThresholdFilter { setLevel("ERROR") }
  val piiFilter = new PiiFilter

  errorLevelFilter.start()
  piiFilter.start()

}
