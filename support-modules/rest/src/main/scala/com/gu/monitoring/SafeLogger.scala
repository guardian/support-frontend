package com.gu.monitoring

import com.gu.monitoring.SafeLogger.LogMessage
import com.typesafe.scalalogging.{Logger, StrictLogging}
import org.slf4j.{LoggerFactory, Marker, MarkerFactory}

trait SafeLogging {

  protected val logger: SafeLoggerImpl =
    new SafeLoggerImpl(Logger(LoggerFactory.getLogger(getClass.getName)))

  implicit class Sanitizer(val sc: StringContext) {
    def scrub(args: Any*): LogMessage = {
      LogMessage(sc.s(args: _*), sc.s(args.map(_ => "*****"): _*))
    }
  }

}

object SafeLogger {

  val sanitizedLogMessage: Marker = MarkerFactory.getMarker("SENTRY")

  case class LogMessage(withPersonalData: String, withoutPersonalData: String) {
    override val toString = withoutPersonalData
  }

}

class SafeLoggerImpl(logger: Logger) {

  def debug(logMessage: String): Unit = {
    logger.debug(logMessage)
  }

  def info(logMessage: String): Unit = {
    logger.info(logMessage)
  }

  def warn(logMessage: String): Unit = {
    logger.warn(logMessage)
  }

  def warn(logMessage: String, throwable: Throwable): Unit = {
    logger.warn(logMessage, throwable)
  }

  def error(logMessage: LogMessage): Unit = {
    logger.error(logMessage.withPersonalData)
    logger.error(SafeLogger.sanitizedLogMessage, logMessage.withoutPersonalData)
  }

  def error(logMessage: LogMessage, throwable: Throwable): Unit = {
    logger.error(logMessage.withPersonalData, throwable)
    logger.error(SafeLogger.sanitizedLogMessage, s"${logMessage.withoutPersonalData} due to ${throwable.getCause}")
  }

}
