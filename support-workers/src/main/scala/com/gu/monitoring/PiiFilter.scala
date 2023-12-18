package com.gu.monitoring

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply
import org.slf4j.Marker

import scala.jdk.CollectionConverters._

class PiiFilter extends Filter[ILoggingEvent] {
  override def decide(event: ILoggingEvent): FilterReply = {
    val sanitizedMarkerExists = event.getMarkerList.asScala.toList
      .collectFirst(marker => marker.contains(SafeLogger.sanitizedLogMessage))
      .nonEmpty
    if (sanitizedMarkerExists)
      FilterReply.ACCEPT
    else FilterReply.DENY
  }
}
