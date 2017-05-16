package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
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


  "SalesforceService" should "be able to upsert a customer" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))
    val upsertData = UpsertData.create(idId, email, name, name, allowMail, allowMail, allowMail)

    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      response.Success should be(true)
      response.ContactRecord.Id should be(salesforceId)
    }
  }
}
