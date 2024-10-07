package com.gu.support.workers.errors

import com.gu.config.Configuration
import com.gu.i18n.Title
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{
  Authentication,
  DeliveryContact,
  NewContact,
  SalesforceAuthenticationErrorResponse,
  SalesforceErrorResponse,
}
import com.gu.salesforce.{AuthService, SalesforceConfig, SalesforceService}
import com.gu.support.workers.AsyncLambdaSpec
import com.gu.test.tags.annotations.IntegrationTest
import okhttp3.Request
import org.mockito.ArgumentMatchersSugar.any
import org.scalatest.matchers.should.Matchers

import scala.concurrent.duration._

@IntegrationTest
class SalesforceErrorsSpec extends AsyncLambdaSpec with Matchers {

  "AuthService" should "throw a SalesforceAuthenticationErrorResponse" in {
    val invalidConfig = SalesforceConfig("", "https://test.salesforce.com", "", "", "", "", "")
    val authService = new AuthService(invalidConfig)
    recoverToSucceededIf[SalesforceAuthenticationErrorResponse] {
      authService.authorize.map(auth => info(s"Got an auth: $auth"))
    }
  }

  val upsertData: NewContact = NewContact(
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
      service.upsert(upsertData).map(response => info(s"Got a response: $response"))
    }
  }

  "SalesforceService" should "throw a SalesforceErrorResponse if authentication has expired" in {
    val service =
      new SalesforceService(Configuration.load().salesforceConfigProvider.get(), configurableFutureRunner(10.seconds)) {
        // Don't add the authentication headers to simulate an expired auth token
        override def addAuthenticationToRequest(auth: Authentication, req: Request.Builder): Request.Builder =
          req.url(s"${auth.instance_url}/$upsertEndpoint") // We still need to set the base url
      }

    service.upsert(upsertData).map(response => info(s"Got a response: $response"))

    recoverToExceptionIf[SalesforceErrorResponse] {
      service.upsert(upsertData).map(response => info(s"Got a response: $response"))
    }.map(_.message shouldBe "Session expired or invalid")
  }

  /** We were seeing the `upsert` method throw circe decoding errors, which messed with the retry logic of the lambda.
    * This is caused by the Salesforce API error with a `http.status == 200` but `Success == false`.
    */
  "SalesforceService" should "throw a SalesforceErrorResponse when an API returns 200 but Success == false" in {
    val service =
      new SalesforceService(Configuration.load().salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    // This just forces an invalid API call
    val invalidUpsertData = DeliveryContact(
      AccountId = salesforceAccountId,
      Email = Some("integration-test-recipient@thegulocal.com"),
      Salutation = None,
      FirstName = "",
      LastName = "",
      MailingStreet = None,
      MailingCity = None,
      MailingState = None,
      MailingPostalCode = None,
      MailingCountry = None,
    )

    val upsert = service.upsert(invalidUpsertData)
    upsert.failed.map { err =>
      err shouldBe a[SalesforceErrorResponse]
    }
  }
}
