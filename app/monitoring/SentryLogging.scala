package monitoring

import ch.qos.logback.classic.filter.ThresholdFilter
import monitoring.SafeLogger._
import config.Configuration
import io.sentry.Sentry
import io.sentry.logback.SentryAppender

import scala.collection.JavaConverters._
import scala.util.{Failure, Success, Try}
import SentryFilters._
import ch.qos.logback.classic.Logger
import org.slf4j.Logger.ROOT_LOGGER_NAME
import org.slf4j.LoggerFactory

object SentryLogging {
  def init(config: Configuration) {
    config.sentryDsn match {
      case None => SafeLogger.warn("No Sentry logging configured (OK for dev)")
      case Some(sentryDSN) =>
        SafeLogger.info(s"Initialising Sentry logging")
        Try {
          val sentryClient = Sentry.init(sentryDSN)
          val sentryAppender = new SentryAppender {
            addFilter(errorLevelFilter)
            addFilter(piiFilter)
          }

          sentryAppender.start()

          val buildInfo: Map[String, String] = app.BuildInfo.toMap.mapValues(_.toString)
          val tags = Map("stage" -> config.stage.toString) ++ buildInfo
          sentryClient.setTags(tags.asJava)

          LoggerFactory.getLogger(ROOT_LOGGER_NAME).asInstanceOf[Logger].addAppender(sentryAppender)
        } match {
          case Success(_) => SafeLogger.debug("Sentry logging configured.")
          case Failure(e) => SafeLogger.error(scrub"Something went wrong when setting up Sentry logging ${e.getStackTrace}")
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