package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{Authentication, SalesforceContactResponse, UpsertData}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

@IntegrationTest
class SalesforceSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "AuthService" should "be able to retrieve an authtoken" in {
    val authService = new AuthService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))

    authService.authorize.map { auth =>
      auth.access_token.length should be > 0
    }
  }

  it should "reuse that token" in {
    val authService = new AuthService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))

    val futureAuths = for {
      auth <- AuthService.getAuth
      auth2 <- AuthService.getAuth
    } yield (auth, auth2)

    futureAuths.map { auths: (Authentication, Authentication) =>
      auths._1.issued_at.getMillis should be(auths._2.issued_at.getMillis)
      auths._1.access_token should be(auths._2.access_token)
    }
  }

  "SalesforceService" should "be able to upsert a customer" in {
    val service = new SalesforceService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))
    val upsertData = UpsertData.create(idId, email, name, name, allowMail, allowMail, allowMail)

    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      response.Success should be(true)
      response.ContactRecord.Id should be(salesforceId)
    }
  }
}
