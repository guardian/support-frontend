package com.gu.stripeIntent

import com.gu.handler.{ApiGatewayRequest, ApiGatewayResponse, Ok}
import com.gu.support.config.Stages
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.{AsyncFlatSpec, Matchers}

@IntegrationTest
class HandlerITSpec extends AsyncFlatSpec with Matchers {


  it should "fetch a test secret from a test key" in {

    val result = Handler.lambdaApiGateway(
      Handler.minimalEnvironment(),
      ApiGatewayRequest("""{"publicKey": "pk_test_Qm3CGRdrV4WfGYCpm0sftR0f"}""")// even the live one is in the public html
    )

    result.map{ resp =>
      // this is a bit hacky, due to the fact that ApiGatewayResponse.apply is just a smart constructor
      val probablyKey = resp.body.replaceAll("^.*seti_", "seti_")
          .replaceAll(""""}$""", "")
      resp should be(ApiGatewayResponse(Ok, ResponseBody(probablyKey), Stages.DEV))
    }
  }

}
