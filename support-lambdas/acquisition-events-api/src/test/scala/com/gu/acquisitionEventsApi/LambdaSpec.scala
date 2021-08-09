package com.gu.acquisitionEventsApi

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

class LambdaSpec extends AnyFlatSpec with Matchers {
  it should "successfully get big query config from SSM" in {
    val request = new APIGatewayProxyRequestEvent()
    val result = Lambda.handler(request)
    println(result)
  }
}
