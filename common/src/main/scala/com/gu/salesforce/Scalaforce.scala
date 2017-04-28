package com.gu.salesforce

import akka.actor.Scheduler
import akka.agent.Agent
import com.gu.helpers.{Retry, Timing}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.typesafe.scalalogging.LazyLogging
import okhttp3._
import play.api.libs.json._

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

case class SFResponse(Success: Boolean, ErrorString: Option[String])

case class SFContactRecord(Id: String, AccountId: String, IdentityID__c: Option[String])

case class SFContactId(get: String)

object SFContactRecord extends LazyLogging {
  implicit val readsSFResponse = Json.reads[SFResponse]
  implicit val readsSFContactRecord = Json.reads[SFContactRecord]

  def readResponse(response: JsValue): JsResult[SFContactRecord] = {
    val someKindOfSFResponse = response.validate[SFResponse]

    val contactRecordJsResult: JsResult[SFContactRecord] = for {
      goodSFResponse <- someKindOfSFResponse.filter(JsError("Salesforce response: fails - Success was false"))(_.Success)
      goodContactRecord <- (response \ "ContactRecord").validate[SFContactRecord]
    } yield goodContactRecord

    contactRecordJsResult match {
      case e: JsError => logger.warn(s"Error on SF response: $e - response was $someKindOfSFResponse")
      case _ => // We just want to log when stuff goes bad
    }

    contactRecordJsResult
  }
}

case class Authentication(access_token: String, instance_url: String)

case class ScalaforceError(s: String) extends Throwable {
  override def getMessage: String = s
}

/**
  * Uses the Salesforce Username-Password Flow to get access tokens.
  *
  * https://help.salesforce.com/apex/HTViewHelpDoc?id=remoteaccess_oauth_username_password_flow.htm
  * https://www.salesforce.com/us/developer/docs/api_rest/Content/intro_understanding_username_password_oauth_flow.htm
  */

abstract class Scalaforce(implicit ec: ExecutionContext) extends LazyLogging {
  val stage: String
  val application: String
  val sfConfig: SalesforceConfig
  val httpClient: FutureHttpClient
  val sfScheduler: Scheduler

  val authAgent: Agent[Option[Authentication]] = Agent(None)

  //Initialise this with none,
  // and block healthcheck until we get auth
  def isAuthenticated: Boolean = authAgent.get().isDefined

  object Status {
    val OK = 200
    val NOT_FOUND = 404
  }


  protected def issueRequest(req: Request): Future[Response] = {
    val requestLog = s"${req.method()} to ${req.url()}"
    logger.info(requestLog)

    httpClient(req).map { response =>
      logger.info(requestLog + s" returned ${response.code()}")
      response
    }
  }

  private def urlAuth: Option[(String) => Request.Builder] =
    authAgent().map { auth =>
      (endpoint: String) => {
        new Request.Builder()
          .url(s"${auth.instance_url}/$endpoint")
          .addHeader("Authorization", s"Bearer ${auth.access_token}")
      }
    }

  val noAuthenticationFailure = Future.failed(ScalaforceError("We tried to do something before we had an auth token."))

  private def get(endpoint: String): Future[Response] = urlAuth.map { url =>
    issueRequest(url(endpoint).get().build())
  }.getOrElse(noAuthenticationFailure)


  private def post(endpoint: String, updateData: JsValue): Future[Response] = {
    val mediaType = MediaType.parse("application/json; charset=utf-8")
    val body = RequestBody.create(mediaType, Json.stringify(updateData))
    urlAuth.map { url =>
      issueRequest(url(endpoint).post(body).build())
    }.getOrElse(noAuthenticationFailure)
  }

  private def patch(endpoint: String, updateData: JsValue): Future[Response] = {
    val mediaType = MediaType.parse("application/json; charset=utf-8")
    val body = RequestBody.create(mediaType, Json.stringify(updateData))
    urlAuth.map { url =>
      issueRequest(url(endpoint).patch(body).build())
    }.getOrElse(noAuthenticationFailure)
  }

  private def jsonParse(response: String): JsValue = Json.parse(response)

  val serviceName = "Salesforce"

  object Contact {
    def read(key: String, id: String): Future[Either[String, Option[JsValue]]] = {
      val path = s"services/data/v29.0/sobjects/Contact/$key/$id"
      Timing.record(serviceName, "Read Contact") {
        get(path)
      }.map { response =>
        val bodyString = response.body().string() // out here to make sure connection is closed in all cases
        response.code() match {
          case Status.OK => Right(Some(jsonParse(bodyString)))
          case Status.NOT_FOUND => Right(None)
          case code => Left(s"SF003: Salesforce returned code $code for Contact read $key $id")
        }
      }
    }

    /**
      * We use a custom endpoint to upsert contacts because Salesforce doesn't return enough data
      * on its own. N.B: "newContact" is used both inserts and updates
      */
    def upsert(upsertKey: Option[(String, String)], data: JsObject): Future[SFContactRecord] = {
      val updateData = upsertKey.map { case (key, value) =>
        data + (key -> JsString(value))
      }.getOrElse(data)

      val json = Json.obj("newContact" -> updateData)
      logger.info(s"Upsert json: $json")
      Timing.record(serviceName, "Upsert Contact") {
        post("services/apexrest/RegisterCustomer/v1/", json)
      }.map { response =>
        val rawResponse = response.body().string()
        val result = SFContactRecord.readResponse(jsonParse(rawResponse))
        result.getOrElse(throw ScalaforceError(s"Bad upsert response $rawResponse"))
      }
    }

    def update(id: SFContactId, newKey: String, newValue: String): Future[Unit] = Timing.record(serviceName, "Update Contact") {
      patch(s"services/data/v20.0/sobjects/Contact/${id.get}", Json.obj(newKey -> newValue))
    }.flatMap { r =>
      val output = r.body().string()
      r.body().close()
      if (r.code() == 204) {
        Future(Unit)
      } else {
        Future.failed(new Exception(s"Bad code for update ${r.code}: $output"))
      }
    }
  }

  // 15min -> 96 request/day. Failed auth will not override previous access_token.
  def startAuth() = sfScheduler.schedule(0.seconds, 15.minutes)(authorize.map(auth => authAgent.send(Some(auth))))

  private[salesforce] def authorize: Future[Authentication] = {
    logger.info(s"Trying to authenticate with Salesforce $stage...")

    val formBody = new FormBody.Builder()
      .add("client_id", sfConfig.key)
      .add("client_secret", sfConfig.secret)
      .add("username", sfConfig.username)
      .add("password", sfConfig.password + sfConfig.token)
      .add("grant_type", "password")
      .build()

    val request = new Request.Builder().url(s"${sfConfig.url}/services/oauth2/token").post(formBody).build()

    def postAuthRequest: Future[Authentication] = issueRequest(request).map { response =>
      implicit val personReads = Json.reads[Authentication]
      val responseBody = jsonParse(response.body().string())
      responseBody.validate[Authentication] match {
        case JsSuccess(result, _) =>
          logger.info(s"Successful Salesforce $stage authentication.")
          result

        case _ => throw ScalaforceError(s"Failed Salesforce $stage authentication: CODE = ${response.code()}; Response = $responseBody")
      }
    }

    Retry(3) {
      postAuthRequest
    }
  }

}
