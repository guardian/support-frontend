package monitoring

import ch.qos.logback.classic.filter.ThresholdFilter
import ch.qos.logback.classic.{Logger, LoggerContext}
import com.getsentry.raven.RavenFactory
import com.getsentry.raven.dsn.Dsn
import com.getsentry.raven.logback.SentryAppender
import org.slf4j.Logger.ROOT_LOGGER_NAME
import org.slf4j.LoggerFactory
import config.Stage
import app.BuildInfo
import com.typesafe.scalalogging.LazyLogging

object SentryLogging {
  val AllMDCTags = Seq()
}

class SentryLogging(dsnConfig: String, stage: Stage) extends LazyLogging {
  val dsn = new Dsn(dsnConfig)
  logger.info(s"Initialising Sentry logging for ${dsn.getHost}")
  val tags = Map("stage" -> stage.toString) ++ BuildInfo.toMap
  val tagsString = tags.map { case (k, v) => s"$k:$v" }.mkString(",")
  val filter = new ThresholdFilter { setLevel("ERROR") }
  filter.start()
  val sentryAppender = new SentryAppender(RavenFactory.ravenInstance(dsn)) {
    addFilter(filter)
    setTags(tagsString)
    setRelease(BuildInfo.gitCommitId)
    setExtraTags(SentryLogging.AllMDCTags.mkString(","))
    setContext(LoggerFactory.getILoggerFactory.asInstanceOf[LoggerContext])
  }
  sentryAppender.start()
  LoggerFactory.getLogger(ROOT_LOGGER_NAME).asInstanceOf[Logger].addAppender(sentryAppender)
}
