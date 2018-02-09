package monitoring

import ch.qos.logback.classic.filter.ThresholdFilter
import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply
import com.typesafe.scalalogging.LazyLogging
import org.slf4j.{Marker, MarkerFactory}

class PiiFilter extends Filter[ILoggingEvent] {
  override def decide(event: ILoggingEvent): FilterReply = if (event.getMarker.contains(SafeLogger.sanitizedLogMessage)) FilterReply.ACCEPT
  else FilterReply.DENY
}

object SafeLogger extends LazyLogging {

  val sanitizedLogMessage: Marker = MarkerFactory.getMarker("SENTRY")

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
    logger.error(SafeLogger.sanitizedLogMessage, logMessage.sanitized)
  }

  def error(logMessage: LogMessage, throwable: Throwable): Unit = {
    logger.error(logMessage.asTyped, throwable)
    logger.error(SafeLogger.sanitizedLogMessage, s"${logMessage.sanitized} due to ${throwable.getCause}")
  }

}

object SentryFilters {

  val errorLevelFilter = new ThresholdFilter { setLevel("ERROR") }
  val piiFilter = new PiiFilter

  errorLevelFilter.start()
  piiFilter.start()

}
