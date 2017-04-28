package com.gu.salesforce

import akka.actor.ActorSystem
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.typesafe.scalalogging.LazyLogging
import okhttp3.{Request, Response}
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

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
}
