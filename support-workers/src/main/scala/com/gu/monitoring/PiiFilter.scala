package com.gu.monitoring

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply
import scala.jdk.CollectionConverters._

class PiiFilter extends Filter[ILoggingEvent] {
  override def decide(event: ILoggingEvent): FilterReply =
    if (event.getMarkerList.asScala.toList.exists(marker => marker.contains(SafeLogger.sanitizedLogMessage)))
      FilterReply.ACCEPT
    else FilterReply.DENY
}
