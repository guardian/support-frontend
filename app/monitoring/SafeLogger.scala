package monitoring

import ch.qos.logback.classic.filter.ThresholdFilter
import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply
import com.typesafe.scalalogging.LazyLogging

object SafeLogger extends LazyLogging {

  case class LogMessage(asTyped: String, sanitized: String) {
    override val toString = sanitized
  }

  implicit class Sanitizer(val sc: StringContext) extends AnyVal {
    def scrub(args: Any*): LogMessage = {
      LogMessage(sc.s(args: _*), sc.s(args.map(_ => "*****"): _*))
    }
  }

  def info(logMessage: String): Unit = {
    logger.info(logMessage)
  }

  def warn(logMessage: String): Unit = {
    logger.warn(logMessage)
  }

  def error(logMessage: LogMessage): Unit = {
    logger.error(logMessage.asTyped)
    logger.error(SentryLogging.sanitizedLogMessage, logMessage.sanitized)
  }

}

object LogFilters {

  class PiiFilter extends Filter[ILoggingEvent] {
    override def decide(event: ILoggingEvent): FilterReply = if (event.getMarker.contains(SentryLogging.sanitizedLogMessage)) FilterReply.ACCEPT
    else FilterReply.DENY
  }

  // Used in logback.xml, so that errors aren't duplicated in application logs
  class SentryErrorFilter extends Filter[ILoggingEvent] {
    override def decide(event: ILoggingEvent): FilterReply = if (event.getMarker.contains(SentryLogging.sanitizedLogMessage)) FilterReply.DENY
    else FilterReply.ACCEPT
  }

  val errorLevelFilter = new ThresholdFilter { setLevel("ERROR") }
  val piiFilter = new PiiFilter
  val sentryErrorFilter = new SentryErrorFilter

  errorLevelFilter.start()
  piiFilter.start()

}
