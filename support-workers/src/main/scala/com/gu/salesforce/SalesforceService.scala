package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.helpers.{Retry, WebServiceHelper}
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.salesforce.Salesforce._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.AddressLine.asFormattedString
import com.gu.support.workers.AddressLineTransformer.combinedAddressLine
import com.gu.support.workers.{Address, GiftRecipient, SalesforceContactRecord, User}
import io.circe
import io.circe.Decoder
import io.circe.parser._
import io.circe.syntax._
import okhttp3.Request

import scala.concurrent.duration._
import scala.concurrent.stm._
import scala.concurrent.{Await, ExecutionContext, Future}

class SalesforceService(config: SalesforceConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
  extends WebServiceHelper[SalesforceErrorResponse] {
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
    postJson[SalesforceContactResponse](upsertEndpoint, data.asJson)
  }

  def createContactRecords(user: User, giftRecipient: Option[GiftRecipient]): Future[SalesforceContactRecordsResponse] = {
    for {
      contactRecord <- upsert(getNewContact(user))
      recipientContactRecord <- maybeAddGiftRecipient(
        contactRecord.ContactRecord,
        giftRecipient,
        user.deliveryAddress.getOrElse(user.billingAddress)
      )
    } yield SalesforceContactRecordsResponse(contactRecord, recipientContactRecord)
  }

  private def maybeAddGiftRecipient(contactRecord: SalesforceContactRecord, maybeGiftRecipient: Option[GiftRecipient], deliveryAddress: Address) =
    maybeGiftRecipient.map(
      giftRecipient =>
        upsert(getGiftRecipient(contactRecord.AccountId, deliveryAddress, giftRecipient)).map(Some(_))
    ).getOrElse(Future.successful(None))


  private def getNewContact(user: User) =
    NewContact(
      user.id,
      user.primaryEmailAddress,
      user.firstName,
      user.lastName,
      getAddressLine(user.billingAddress),
      user.billingAddress.city,
      user.billingAddress.state,
      user.billingAddress.postCode,
      user.billingAddress.country.name,
      getAddressLine(user.deliveryAddress.getOrElse(user.billingAddress)),
      user.deliveryAddress.flatMap(_.city), //TODO: only if not gift?
      user.deliveryAddress.flatMap(_.state),
      user.deliveryAddress.flatMap(_.postCode),
      user.deliveryAddress.map(_.country.name),
      user.telephoneNumber,
      user.allowMembershipMail,
      user.allowThirdPartyMail,
      user.allowGURelatedMail
    )


  private def getGiftRecipient(buyerAccountId: String, deliveryAddress: Address, giftRecipient: GiftRecipient) =
    DeliveryContact(
      buyerAccountId,
      giftRecipient.email,
      giftRecipient.title,
      giftRecipient.firstName,
      giftRecipient.lastName,
      getAddressLine(deliveryAddress),
      deliveryAddress.city,
      deliveryAddress.state,
      deliveryAddress.postCode,
      Some(deliveryAddress.country.name)
    )

  private def getAddressLine(address: Address) = combinedAddressLine(
    address.lineOne,
    address.lineTwo
  ).map(asFormattedString)
}

/**
 * The AuthService object is responsible for ensuring that we have a valid authentication token for Salesforce.
 * The first time it is asked for an authentication token it will go off and fetch one and then store the result
 * in authRef (one auth token per stage).
 * It also checks the token every time it is used to see whether it has become stale - a problem we
 * have apparently seen in the past despite Salesforce telling us that tokens should be valid for 12hrs. If the token
 * is stale a new one is fetched
 */
object AuthService {

  import scala.concurrent.ExecutionContext.Implicits.global

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
    SafeLogger.info(s"Successfully retrieved Salesforce authentication token for $stage")
    val newAuths = authRef().updated(stage, authentication)
    authRef() = newAuths
  }
}

class AuthService(config: SalesforceConfig)(implicit ec: ExecutionContext)
  extends WebServiceHelper[SalesforceAuthenticationErrorResponse] {
  val sfConfig = config
  val wsUrl = sfConfig.url
  val httpClient: FutureHttpClient = RequestRunners.configurableFutureRunner(10.seconds)

  def authorize: Future[Authentication] = {
    SafeLogger.info(s"Trying to authenticate with Salesforce ${Configuration.stage}...")

    def postAuthRequest: Future[Authentication] =
      postForm[Authentication]("services/oauth2/token", Map(
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

