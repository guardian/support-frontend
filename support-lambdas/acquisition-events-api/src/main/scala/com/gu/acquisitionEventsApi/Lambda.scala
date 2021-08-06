package com.gu.acquisitionEventsApi

import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.typesafe.scalalogging.LazyLogging

object Lambda extends LazyLogging {

  def handler(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    processEvent(event)
  }

  def processEvent(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    val response = new APIGatewayProxyResponseEvent()
    response.setStatusCode(200)
    response
  }
}

