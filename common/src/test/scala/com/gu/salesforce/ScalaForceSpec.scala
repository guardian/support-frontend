package com.gu.salesforce

import akka.actor.ActorSystem
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.salesforce
import com.gu.salesforce.ContactDeserializer.Keys
import com.gu.salesforce.Fixtures.{allowMail, email, idId, name}
import com.typesafe.scalalogging.LazyLogging
import okhttp3.{Request, Response}
import org.scalatest.{AsyncFlatSpec, Matchers}
import play.api.libs.json.JsObject
import play.libs.Json

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

class ScalaForceSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "ScalaForce" should "be able to retrieve an authtoken" in {
    def system = ActorSystem("Test")

    val salesforce: Scalaforce = new Scalaforce {
      val application: String = "test"
      val stage: String = "test"
      val sfConfig: SalesforceConfig = Configuration.salesforceConfig
      val httpClient: (Request) => Future[Response] = RequestRunners.futureRunner
      val sfScheduler = system.scheduler
    }
    salesforce.authorize.map { auth =>
      logger.info(s"Retrieved auth token ${auth.access_token}")
      auth.access_token.length should be > 0
    }
  }

  "AuthService" should "be able to retrieve an authtoken" in {

    val authService = new AuthService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))

    authService.authorize.map { auth =>
      logger.info(s"Retrieved auth token $auth")
      auth.access_token.length should be > 0
    }
  }

  "ScalaForce" should "be able to upsert a user" in {
    def system = ActorSystem("Test")

    val salesforce: Scalaforce = new Scalaforce {
      val application: String = "test"
      val stage: String = "test"
      val sfConfig: SalesforceConfig = Configuration.salesforceConfig
      val httpClient: (Request) => Future[Response] = RequestRunners.futureRunner
      val sfScheduler = system.scheduler
    }

    salesforce.authAgent.send(Some(Authentication("00Dg0000006RDAM!AREAQN9n2ytY7_GnSFkaKsmXtjpD1fKvwFKzcIPTjUG4YWPGby9ktjXPNihs3eq74byAYaK9ygZlxWpoDyorcHWG741fmuSJ", "https://cs17.salesforce.com")))

    salesforce.Contact.upsert(Some(Keys.IDENTITY_ID -> idId), Fixtures.jsObject).map { contact =>
      logger.info(s"Retrieved contact $contact")
      contact.IdentityID__c should be (Some(Fixtures.idId))
    }
  }

  "SalesforceService" should "be able to upsert a customer" in {
    val service = new SalesforceService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))
    val upsertData = UpsertData(NewContact(idId, email, name, name, allowMail, allowMail, allowMail))
    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      logger.info(s"Retrieved contact id $response")
      response.Success should be (true)
      response.ContactRecord.Id should be ("003g000001UnFItAAN")
    }
  }
}
