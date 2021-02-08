package com.gu.services

import com.gu.model.Stage
import com.gu.services.IncrementalTimeService.lastSuccessfulQueryTime
import com.typesafe.scalalogging.StrictLogging

import java.time.{LocalDateTime, ZoneId}
import java.time.format.DateTimeFormatter

class IncrementalTimeService(parameterStoreService: ParameterStoreService) extends StrictLogging {
  def putLastSuccessfulQueryTime(time: LocalDateTime) = {
    // docs for why we need to do this are here:
    // https://knowledgecenter.zuora.com/Central_Platform/API/AB_Aggregate_Query_API/B_Submit_Query/e_Post_Query_with_Retrieval_Time
    val zonedTime = time.atZone(ZoneId.of("PST"))
    val timeAsString = zonedTime.format(DateTimeFormatter.ISO_DATE_TIME)

    logger.info(s"Setting new value for $lastSuccessfulQueryTime of $timeAsString")
    parameterStoreService.putParameter(
      lastSuccessfulQueryTime,
      timeAsString
    )
  }

}

object IncrementalTimeService{
  val lastSuccessfulQueryTime = "lastSuccessfulQueryTime"

  def apply(stage: Stage) = new IncrementalTimeService(ParameterStoreService(stage))
}
