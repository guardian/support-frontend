package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{Authentication, SalesforceAuthenticationErrorResponse, SalesforceContactResponse, SalesforceErrorResponse, UpsertData}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import okhttp3.Request
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

@IntegrationTest
class SalesforceSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "AuthService" should "be able to retrieve an authtoken" in {
    val authService = new AuthService(Configuration.salesforceConfigProvider.get())

    authService.authorize.map { auth =>
      auth.access_token.length should be > 0
    }
  }

  it should "reuse that token" in {
    val config = Configuration.salesforceConfigProvider.get()

    val futureAuths = for {
      auth <- AuthService.getAuth(config)
      auth2 <- AuthService.getAuth(config)
    } yield (auth, auth2)

    futureAuths.map { auths: (Authentication, Authentication) =>
      auths._1.issued_at.getMillis should be(auths._2.issued_at.getMillis)
      auths._1.access_token should be(auths._2.access_token)
    }
  }

  it should "get a different auth token for each stage" in {
    val config = Configuration.salesforceConfigProvider.get()

    val futureAuths = for {
      devAuth <- AuthService.getAuth(Configuration.salesforceConfigProvider.get())
      uatAuth <- AuthService.getAuth(Configuration.salesforceConfigProvider.get(true))
    } yield (devAuth, uatAuth)

    futureAuths.map { auths: (Authentication, Authentication) =>
      auths._1.access_token should not be auths._2.access_token
    }
  }

  it should "throw a SalesforceAuthenticationErrorResponse" in {
    val invalidConfig = SalesforceConfig("", "https://test.salesforce.com", "", "", "", "", "")
    val authService = new AuthService(invalidConfig)
    recoverToSucceededIf[SalesforceAuthenticationErrorResponse] {
      authService.authorize.map(auth => logger.info(s"Got an auth: $auth"))
    }
  }

  "SalesforceService" should "be able to upsert a customer" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))
    val upsertData = UpsertData.create(idId, email, name, name, allowMail, allowMail, allowMail)

    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      response.Success should be(true)
      response.ContactRecord.Id should be(salesforceId)
    }
  }

  it should "throw a SalesforceAuthenticationErrorResponse if the authentication fails" in {
    val invalidConfig = SalesforceConfig("", "https://test.salesforce.com", "", "", "", "", "")
    val upsertData = UpsertData.create(idId, email, name, name, allowMail, allowMail, allowMail)
    val service = new SalesforceService(invalidConfig, configurableFutureRunner(10.seconds))

    assertThrows[SalesforceAuthenticationErrorResponse]{
      service.upsert(upsertData).map(response => logger.info(s"Got a response: $response"))
    }
  }

  it should "throw a SalesforceErrorResponse if authentication has expired" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds)) {
      //Don't add the authentication headers to simulate an expired auth token
      override def addAuthenticationToRequest(auth: Authentication, req: Request.Builder) =
        req.url(s"${auth.instance_url}/$upsertEndpoint") //We still need to set the base url
    }
    val upsertData = UpsertData.create(idId, email, name, name, allowMail, allowMail, allowMail)

    recoverToSucceededIf[SalesforceErrorResponse] {
      service.upsert(upsertData).map(response => logger.info(s"Got a response: $response"))
    }
  }

}
