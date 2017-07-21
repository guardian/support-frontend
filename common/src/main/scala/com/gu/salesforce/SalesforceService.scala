package com.gu.salesforce

import cats.syntax.either._
import com.gu.config.Configuration
import com.gu.helpers.{Retry, WebServiceHelper}
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.salesforce.Salesforce.{Authentication, SalesforceAuthenticationErrorResponse, SalesforceContactResponse, SalesforceErrorResponse, UpsertData}
import com.gu.zuora.encoding.CustomCodecs
import com.typesafe.scalalogging.LazyLogging
import io.circe
import io.circe.Decoder
import io.circe.parser._
import io.circe.syntax._
import okhttp3.Request

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.stm._
import scala.concurrent.{Await, ExecutionContext, Future}

class SalesforceService(config: SalesforceConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
    extends WebServiceHelper[SalesforceErrorResponse]
    with LazyLogging {
  val sfConfig = config
  val wsUrl = sfConfig.url
  val httpClient: FutureHttpClient = client
  val upsertEndpoint = "services/apexrest/RegisterCustomer/v1/"

  override def wsPreExecute(req: Request.Builder): Request.Builder =
    Await.result( //We have to wait for an authentication token before we can send any requests
      AuthService.getAuth(config).map(
        auth => addAuthenticationToRequest(auth, req)
      ), 30.seconds
    )

  def addAuthenticationToRequest(auth: Authentication, req: Request.Builder): Request.Builder = {
    req.url(s"${auth.instance_url}/$upsertEndpoint") //We need to set the base url to the instance_url value returned in the authentication response
    req.addHeader("Authorization", s"Bearer ${auth.access_token}") //And also add an Authorization header
  }

  override def decodeError(responseBody: String)(implicit errorDecoder: Decoder[SalesforceErrorResponse]): Either[circe.Error, SalesforceErrorResponse] =
    decode[List[SalesforceErrorResponse]](responseBody).map(_.head) //Salesforce returns a list of error responses

  def upsert(data: UpsertData): Future[SalesforceContactResponse] = {
    post[SalesforceContactResponse](upsertEndpoint, data.asJson)
  }
}

/**
 * The AuthService object is responsible for ensuring that we have a valid authentication token for Salesforce.
 * The first time it is asked for an authentication token it will go off and fetch one and then store the result
 * in authRef (one auth token per stage).
 * It also checks the token every time it is used to see whether it has become stale - a problem we
 * have apparently seen in the past despite Salesforce telling us that tokens should be valid for 12hrs. If the token
 * is stale a new one is fetched
 */
object AuthService extends LazyLogging {

  private val authRef = Ref[Map[String, Authentication]](Map())

  def getAuth(config: SalesforceConfig): Future[Authentication] =
    authRef.single().get(config.environment).filter(_.isFresh) match {
      case Some(authentication) =>
        Future.successful(authentication)
      case None => fetchAuth(config)
    }

  private def fetchAuth(config: SalesforceConfig) = new AuthService(config).authorize.map(authentication => {
    storeAuth(authentication, config.environment)
    authentication
  })

  private def storeAuth(authentication: Authentication, stage: String) = atomic { implicit txn =>
    logger.info(s"Successfully retrieved Salesforce authentication token for $stage")
    val newAuths = authRef().updated(stage, authentication)
    authRef() = newAuths
  }
}

class AuthService(config: SalesforceConfig)(implicit ec: ExecutionContext)
    extends WebServiceHelper[SalesforceAuthenticationErrorResponse]
    with LazyLogging with CustomCodecs {
  val sfConfig = config
  val wsUrl = sfConfig.url
  val httpClient: FutureHttpClient = RequestRunners.configurableFutureRunner(10.seconds)

  def authorize: Future[Authentication] = {
    logger.info(s"Trying to authenticate with Salesforce ${Configuration.stage}...")

    def postAuthRequest: Future[Authentication] =
      post[Authentication]("services/oauth2/token", Map(
        "client_id" -> Seq(sfConfig.key),
        "client_secret" -> Seq(sfConfig.secret),
        "username" -> Seq(sfConfig.username),
        "password" -> Seq(sfConfig.password + sfConfig.token),
        "grant_type" -> Seq("password")
      ))

    Retry(3) {
      postAuthRequest
    }
  }
}

