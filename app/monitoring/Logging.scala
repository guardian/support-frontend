package monitoring

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply
import com.typesafe.scalalogging.LazyLogging
import org.slf4j.{Marker, MarkerFactory}

// This filter is referenced in logback.xml
class PiiFilter extends Filter[ILoggingEvent] {
  override def decide(event: ILoggingEvent): FilterReply = if (event.getMarker.contains(SafeLogger.sanitizedLogMessage)) FilterReply.ACCEPT
  else FilterReply.DENY
}

object SafeLogger extends LazyLogging {

  // Used to mark scrubbed messages suitable to be sent to Sentry.
  val sanitizedLogMessage: Marker = MarkerFactory.getMarker("SENTRY")

  case class LogMessage(raw: String, sanitized: String) {
    override val toString = sanitized
  }

  implicit class Sanitizer(val sc: StringContext) extends AnyVal {
    def scrub(args: Any*): LogMessage = {
      LogMessage(sc.s(args: _*), sc.s(args.map(_ => "*****"): _*))
    }
  }

  def debug(logMessage: String): Unit = {
    logger.debug(logMessage)
  }

  def info(logMessage: String): Unit = {
    logger.info(logMessage)
  }

  def warn(logMessage: String): Unit = {
    logger.warn(logMessage)
  }

  def error(logMessage: LogMessage): Unit = {
    logger.error(logMessage.raw)
    logger.error(SafeLogger.sanitizedLogMessage, logMessage.sanitized)
  }

  def error(logMessage: LogMessage, throwable: Throwable): Unit = {
    logger.error(logMessage.raw, throwable)
    logger.error(SafeLogger.sanitizedLogMessage, s"${logMessage.sanitized} due to ${throwable.getCause}")
  }

}

