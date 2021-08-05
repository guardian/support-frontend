package com.gu.acquisitionEventsApi

import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.typesafe.scalalogging.LazyLogging

object Lambda extends LazyLogging {

  def handler(event: APIGatewayProxyRequestEvent): Unit = {
    processEvent(event)
  }

  def processEvent(event: APIGatewayProxyRequestEvent) = {}
}

