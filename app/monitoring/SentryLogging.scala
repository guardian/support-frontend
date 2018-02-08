package monitoring

import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply
import ch.qos.logback.classic.filter.ThresholdFilter
import ch.qos.logback.classic.{Logger, LoggerContext}
import ch.qos.logback.classic.spi.ILoggingEvent
import com.getsentry.raven.RavenFactory
import com.getsentry.raven.dsn.Dsn
import com.getsentry.raven.logback.SentryAppender
import org.slf4j.Logger.ROOT_LOGGER_NAME
import org.slf4j.{LoggerFactory, Marker, MarkerFactory}
import com.gu.support.config.Stage
import app.BuildInfo
import com.typesafe.scalalogging.LazyLogging

object SentryLogging {
  val AllMDCTags = Seq()
  val noPii: Marker = MarkerFactory.getMarker("noPII")
}

object SentryLogFilters {

  class NoPiiFilter extends Filter[ILoggingEvent] {
    override def decide(event: ILoggingEvent): FilterReply = if (event.getMarker.contains(SentryLogging.noPii)) FilterReply.ACCEPT
    else FilterReply.DENY
  }

  val errorLevelFilter = new ThresholdFilter { setLevel("ERROR") }
  val piiFilter = new NoPiiFilter

  SentryLogFilters.errorLevelFilter.start()
  SentryLogFilters.piiFilter.start()

}

class SentryLogging(dsnConfig: String, stage: Stage) extends LazyLogging {
  val dsn = new Dsn(dsnConfig)
  logger.info(s"Initialising Sentry logging for ${dsn.getHost}")
  val tags = Map("stage" -> stage.toString) ++ BuildInfo.toMap
  val tagsString = tags.map { case (k, v) => s"$k:$v" }.mkString(",")
  val sentryAppender = new SentryAppender(RavenFactory.ravenInstance(dsn)) {
    addFilter(SentryLogFilters.errorLevelFilter)
    addFilter(SentryLogFilters.piiFilter)
    setTags(tagsString)
    setRelease(BuildInfo.gitCommitId)
    setExtraTags(SentryLogging.AllMDCTags.mkString(","))
    setContext(LoggerFactory.getILoggerFactory.asInstanceOf[LoggerContext])
  }
  sentryAppender.start()
  LoggerFactory.getLogger(ROOT_LOGGER_NAME).asInstanceOf[Logger].addAppender(sentryAppender)
}
