package com.gu.support.workers.errors

import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{Authentication, SalesforceAuthenticationErrorResponse, SalesforceErrorResponse, UpsertData}
import com.gu.salesforce.{AuthService, SalesforceConfig, SalesforceService}
import com.gu.support.workers.AsyncLambdaSpec
import com.gu.test.tags.annotations.IntegrationTest
import okhttp3.Request
import org.scalatest.Matchers

import scala.concurrent.duration._

@IntegrationTest
class SalesforceErrorsSpec extends AsyncLambdaSpec with Matchers {
  "AuthService" should "throw a SalesforceAuthenticationErrorResponse" in {
    val invalidConfig = SalesforceConfig("", "https://test.salesforce.com", "", "", "", "", "")
    val authService = new AuthService(invalidConfig)
    recoverToSucceededIf[SalesforceAuthenticationErrorResponse] {
      authService.authorize.map(auth => SafeLogger.info(s"Got an auth: $auth"))
    }
  }

  it should "throw a SalesforceAuthenticationErrorResponse if the authentication fails" in {
    val invalidConfig = SalesforceConfig("", "https://test.salesforce.com", "", "", "", "", "")
    val upsertData = UpsertData.create(idId, email, name, name, None, us, allowMail, allowMail, allowMail, None)
    val service = new SalesforceService(invalidConfig, configurableFutureRunner(10.seconds))

    assertThrows[SalesforceAuthenticationErrorResponse] {
      service.upsert(upsertData).map(response => SafeLogger.info(s"Got a response: $response"))
    }
  }

  "SalesforceService" should "throw a SalesforceErrorResponse if authentication has expired" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds)) {
      //Don't add the authentication headers to simulate an expired auth token
      override def addAuthenticationToRequest(auth: Authentication, req: Request.Builder): Request.Builder =
        req.url(s"${auth.instance_url}/$upsertEndpoint") //We still need to set the base url
    }
    val upsertData = UpsertData.create(idId, email, name, name, None, us, allowMail, allowMail, allowMail, None)

    recoverToSucceededIf[SalesforceErrorResponse] {
      service.upsert(upsertData).map(response => SafeLogger.info(s"Got a response: $response"))
    }
  }

}
