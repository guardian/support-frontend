package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{SalesforceContactResponse, UpsertData}
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class SalesforceSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "AuthService" should "be able to retrieve an authtoken" in {
    val authService = new AuthService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))

    authService.authorize.map { auth =>
      logger.info(s"Retrieved auth token $auth")
      auth.access_token.length should be > 0
    }
  }

  "SalesforceService" should "be able to upsert a customer" in {
    val service = new SalesforceService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))
    val upsertData = UpsertData.create(idId, email, name, name, allowMail, allowMail, allowMail)

    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      logger.info(s"Retrieved contact id $response")
      response.Success should be(true)
      response.ContactRecord.Id should be(salesforceId)
    }
  }
}
