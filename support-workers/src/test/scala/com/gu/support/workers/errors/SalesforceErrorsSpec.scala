package com.gu.support.workers.errors

import com.gu.config.Configuration
import com.gu.i18n.Title
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{
  Authentication,
  NewContact,
  SalesforceAuthenticationErrorResponse,
  SalesforceErrorResponse,
  UpsertData,
}
import com.gu.salesforce.{AuthService, SalesforceConfig, SalesforceService}
import com.gu.support.workers.AsyncLambdaSpec
import com.gu.test.tags.annotations.IntegrationTest
import okhttp3.Request
import org.scalatest.matchers.should.Matchers

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

  val upsertData = NewContact(
    IdentityID__c = idId,
    Email = emailAddress,
    Salutation = Some(Title.Ms),
    FirstName = name,
    LastName = name,
    OtherStreet = None,
    OtherCity = None,
    OtherState = None,
    OtherPostalCode = None,
    OtherCountry = us,
    MailingStreet = None,
    MailingCity = None,
    MailingState = None,
    MailingPostalCode = None,
    MailingCountry = None,
    Phone = None,
  )

  it should "throw a SalesforceAuthenticationErrorResponse if the authentication fails" in {
    val invalidConfig = SalesforceConfig("", "https://test.salesforce.com", "", "", "", "", "")

    val service = new SalesforceService(invalidConfig, configurableFutureRunner(10.seconds))

    recoverToSucceededIf[SalesforceAuthenticationErrorResponse] {
      service.upsert(upsertData).map(response => SafeLogger.info(s"Got a response: $response"))
    }
  }

  "SalesforceService" should "throw a SalesforceErrorResponse if authentication has expired" in {
    val service =
      new SalesforceService(Configuration.load().salesforceConfigProvider.get(), configurableFutureRunner(10.seconds)) {
        // Don't add the authentication headers to simulate an expired auth token
        override def addAuthenticationToRequest(auth: Authentication, req: Request.Builder): Request.Builder =
          req.url(s"${auth.instance_url}/$upsertEndpoint") // We still need to set the base url
      }

    service.upsert(upsertData).map(response => SafeLogger.info(s"Got a response: $response"))

    recoverToExceptionIf[SalesforceErrorResponse] {
      service.upsert(upsertData).map(response => SafeLogger.info(s"Got a response: $response"))
    }.map(_.message shouldBe "Session expired or invalid")
  }

}
