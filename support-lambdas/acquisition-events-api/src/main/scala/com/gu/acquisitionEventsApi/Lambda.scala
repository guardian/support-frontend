package com.gu.acquisitionEventsApi

import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode
import com.gu.support.acquisitions.models.AcquisitionDataRow

object Lambda extends LazyLogging {

  def handler(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    processEvent(event)
  }

  def processEvent(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    val rawBody = event.getBody()
    decode[AcquisitionDataRow](rawBody)
      .map { acq => }
    val response = new APIGatewayProxyResponseEvent()
    response.setStatusCode(200)
    response
  }
}

