package monitoring

import ch.qos.logback.classic.{Logger, LoggerContext}
import com.getsentry.raven.RavenFactory
import com.getsentry.raven.dsn.Dsn
import com.getsentry.raven.logback.SentryAppender
import org.slf4j.Logger.ROOT_LOGGER_NAME
import org.slf4j.{LoggerFactory, Marker, MarkerFactory}
import com.gu.support.config.Stage
import app.BuildInfo

object SentryLogging {
  val AllMDCTags = Seq()
  val sanitizedLogMessage: Marker = MarkerFactory.getMarker("sanitizedLogMessage")
}

class SentryLogging(dsnConfig: String, stage: Stage) {
  val dsn = new Dsn(dsnConfig)
  SafeLogger.info(s"Initialising Sentry logging for ${dsn.getHost}")
  val tags = Map("stage" -> stage.toString) ++ BuildInfo.toMap
  val tagsString = tags.map { case (k, v) => s"$k:$v" }.mkString(",")
  val sentryAppender = new SentryAppender(RavenFactory.ravenInstance(dsn)) {
    addFilter(LogFilters.errorLevelFilter)
    addFilter(LogFilters.piiFilter)
    setTags(tagsString)
    setRelease(BuildInfo.gitCommitId)
    setExtraTags(SentryLogging.AllMDCTags.mkString(","))
    setContext(LoggerFactory.getILoggerFactory.asInstanceOf[LoggerContext])
  }
  sentryAppender.start()
  LoggerFactory.getLogger(ROOT_LOGGER_NAME).asInstanceOf[Logger].addAppender(sentryAppender)
}
