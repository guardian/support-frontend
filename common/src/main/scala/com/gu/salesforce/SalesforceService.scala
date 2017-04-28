package com.gu.salesforce

import akka.actor.ActorSystem
import akka.agent.Agent
import com.gu.config.Configuration
import com.gu.helpers.{Retry, WebServiceHelper}
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.syntax._
import okhttp3.Request

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}

class SalesforceService(config: SalesforceConfig, client: FutureHttpClient)(implicit ec: ExecutionContext) extends WebServiceHelper[SalesforceContactResponse, SalesforceErrorResponse] with LazyLogging {
  val sfConfig = config
  val wsUrl = sfConfig.url
  val httpClient: FutureHttpClient = client
  val upsertEndpoint = "services/apexrest/RegisterCustomer/v1/"

  override def wsPreExecute(req: Request.Builder): Request.Builder =
    Await.result(//We have to wait for an authentication token before we can send any requests
      AuthService.getAuth.map(
        auth => addAuthenticationToRequest(auth, req)
      ), 30.seconds)

  def addAuthenticationToRequest(auth: Authentication, req: Request.Builder) = {
    req.url(s"${auth.instance_url}/$upsertEndpoint") //We need to set the base url to the instance_url value returned in the authentication response
    req.addHeader("Authorization", s"Bearer ${auth.access_token}") //And also add an Authorization header
  }

  def upsert(data: UpsertData): Future[SalesforceContactResponse] = {
    post[SalesforceContactResponse](upsertEndpoint, data.asJson)
  }
}

/**
  * The AuthService object is responsible for ensuring that we have a valid authentication token for Salesforce.
  * The first time it is asked for an authentication token it will go off and fetch one and then store the result
  * in an Akka Agent for reuse.
  * It also schedules a background refresh of the token every 15 minutes to avoid it becoming stale - a problem we
  * have apparently seen in the past despite Salesforce telling us that tokens should be valid for 12hrs
  */
object AuthService {
  private val service = new AuthService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(10.seconds))

  def system = ActorSystem("AuthService")

  val authAgent: Agent[Option[Authentication]] = Agent(None: Option[Authentication])

  // 15min -> 96 request/day. Failed auth will not override previous access_token.
  def startScheduledAuth() = system.scheduler.schedule(15.minutes, 15.minutes)(service.authorize.map(sendAuth))

  def getAuth: Future[Authentication] = authAgent.get() match {
    case Some(authentication) => Future.successful(authentication)
    case None => service.authorize.map(authentication => {
      sendAuth(authentication)
      authentication
    })
  }

  private def sendAuth(authentication: Authentication) = authAgent.send(Some(authentication))
}

class AuthService(config: SalesforceConfig, client: FutureHttpClient)(implicit ec: ExecutionContext) extends WebServiceHelper[Authentication, ScalaforceError] with LazyLogging {
  val sfConfig = config
  val wsUrl = sfConfig.url
  val httpClient: FutureHttpClient = client

  private[salesforce] def authorize: Future[Authentication] = {
    logger.info(s"Trying to authenticate with Salesforce ${Configuration.stage}...")

    def postAuthRequest: Future[Authentication] =
      post[Authentication]("services/oauth2/token", Map("client_id" -> Seq(sfConfig.key),
        "client_secret" -> Seq(sfConfig.secret),
        "username" -> Seq(sfConfig.username),
        "password" -> Seq(sfConfig.password + sfConfig.token),
        "grant_type" -> Seq("password")))

    Retry(3) {
      postAuthRequest
    }
  }
}

//The odd field names on this class are to match with the Salesforce api
case class UpsertData(newContact: NewContact)

case class NewContact(IdentityID__c: String, Email: String, FirstName: String,
                      LastName: String,
                      Allow_Membership_Mail__c: Boolean,
                      Allow_3rd_Party_Mail__c: Boolean,
                      Allow_Guardian_Related_Mail__c: Boolean)

trait SalesforceResponse {
  val Success: Boolean
  val ErrorString: Option[String]
}

case class SalesforceContactRecord(Id: String, AccountId: String)

case class SalesforceContactResponse(Success: Boolean, ErrorString: Option[String], ContactRecord: SalesforceContactRecord) extends SalesforceResponse

case class  SalesforceErrorResponse(Success: Boolean, ErrorString: Option[String]) extends Throwable with SalesforceResponse

