package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.salesforce.AddressLine.getAddressLine
import com.gu.salesforce.Salesforce._
import com.gu.support.workers.{Address, GiftRecipient, SalesforceContactRecord, User}
import io.circe
import io.circe.Decoder
import io.circe.parser._
import io.circe.syntax._
import okhttp3.Request

import scala.concurrent.duration._
import scala.concurrent.stm._
import scala.concurrent.{ExecutionContext, Future}

class SalesforceService(config: SalesforceConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
    extends WebServiceHelper[SalesforceErrorResponse] {
  val sfConfig: SalesforceConfig = config
  val wsUrl: String = sfConfig.url
  val httpClient: FutureHttpClient = client
  val upsertEndpoint: String = "services/apexrest/RegisterCustomer/v1/"

  override def wsPreExecute(req: Request.Builder): Future[Request.Builder] = {
    logger.info(s"Issuing request to wsPreExecute: $config")
    AuthService.getAuth(config).map(auth => addAuthenticationToRequest(auth, req))
  }

  def addAuthenticationToRequest(auth: Authentication, req: Request.Builder): Request.Builder = {
    req.url(
      s"${auth.instance_url}/$upsertEndpoint",
    ) // We need to set the base url to the instance_url value returned in the authentication response
    req.addHeader("Authorization", s"Bearer ${auth.access_token}") // And also add an Authorization header
  }

  override def decodeError(responseBody: String)(implicit
      errorDecoder: Decoder[SalesforceErrorResponse],
  ): Either[circe.Error, SalesforceErrorResponse] =
    decode[List[SalesforceErrorResponse]](responseBody).map(_.head) // Salesforce returns a list of error responses

  /** We map over the response from `WebServiceHelper.postJson` as there is a case where Salesforce returns
    * `Response.status = 200` with `Success = false` for errors rather than using the HTTP status code to indicate that
    * an error has occurred.
    */
  def upsert(data: UpsertData): Future[SalesforceContactSuccess] = {
    // This is just a convenience class for decoding
    postJson[SalesforceContactResponse](upsertEndpoint, data.asJson).flatMap(parseResponseToResult)
  }

  // This method is public for testing
  def parseResponseToResult(response: SalesforceContactResponse): Future[SalesforceContactSuccess] = if (
    response.Success && response.ContactRecord.isDefined
  ) {
    Future.successful(
      SalesforceContactSuccess(
        Success = response.Success,
        ContactRecord = response.ContactRecord.get,
        ErrorString = response.ErrorString,
      ),
    )
  } else {
    val isReadOnlyMaintenance =
      response.ErrorString.exists(_.contains(SalesforceErrorResponse.readOnlyMaintenance))

    Future.failed(
      SalesforceErrorResponse(
        message = response.ErrorString.getOrElse("Salesforce `Success` returned as `false` with no error message"),
        errorCode = if (isReadOnlyMaintenance) SalesforceErrorResponse.readOnlyMaintenance else "UNKNOWN_ERROR",
      ),
    )
  }

  def createContactRecords(
      user: User,
      giftRecipient: Option[GiftRecipient],
  ): Future[SalesforceContactRecordsResponse] = {
    for {
      contactRecord <- upsert(getNewContact(user, giftRecipient))
      recipientContactRecord <- maybeAddGiftRecipient(
        contactRecord.ContactRecord,
        giftRecipient,
        user,
      )
    } yield SalesforceContactRecordsResponse(contactRecord, recipientContactRecord)
  }

  private def deliveryAddressForGiftRecipientType(giftRecipient: GiftRecipient, user: User) =
    giftRecipient match {
      case _: GiftRecipient.WeeklyGiftRecipient => user.deliveryAddress
      case _: GiftRecipient.DigitalSubscriptionGiftRecipient => None
    }

  private def maybeAddGiftRecipient(
      contactRecord: SalesforceContactRecord,
      maybeGiftRecipient: Option[GiftRecipient],
      user: User,
  ) =
    maybeGiftRecipient
      .filter(recipient => recipient.firstName != "" && recipient.lastName != "")
      .map { giftRecipient =>
        val deliveryAddress = deliveryAddressForGiftRecipientType(giftRecipient, user)
        upsert(getGiftRecipient(contactRecord.AccountId, deliveryAddress, giftRecipient)).map(Some(_))
      }
      .getOrElse(Future.successful(None))

  private def getNewContact(user: User, giftRecipient: Option[GiftRecipient]) =
    giftRecipient
      .map(_ =>
        // If we have a gift recipient then don't update the delivery address
        NewContact(
          IdentityID__c = user.id,
          Email = user.primaryEmailAddress,
          Salutation = user.title,
          FirstName = user.firstName,
          LastName = user.lastName,
          OtherStreet = getAddressLine(user.billingAddress),
          OtherCity = user.billingAddress.city,
          OtherState = user.billingAddress.state,
          OtherPostalCode = user.billingAddress.postCode,
          OtherCountry = user.billingAddress.country.name,
          MailingStreet = None,
          MailingCity = None,
          MailingState = None,
          MailingPostalCode = None,
          MailingCountry = None,
          Phone = user.telephoneNumber,
        ),
      )
      .getOrElse(
        NewContact(
          IdentityID__c = user.id,
          Email = user.primaryEmailAddress,
          Salutation = user.title,
          FirstName = user.firstName,
          LastName = user.lastName,
          OtherStreet = getAddressLine(user.billingAddress),
          OtherCity = user.billingAddress.city,
          OtherState = user.billingAddress.state,
          OtherPostalCode = user.billingAddress.postCode,
          OtherCountry = user.billingAddress.country.name,
          MailingStreet = user.deliveryAddress.flatMap(getAddressLine),
          MailingCity = user.deliveryAddress.flatMap(_.city),
          MailingState = user.deliveryAddress.flatMap(_.state),
          MailingPostalCode = user.deliveryAddress.flatMap(_.postCode),
          MailingCountry = user.deliveryAddress.map(_.country.name),
          Phone = user.telephoneNumber,
        ),
      )

  private def getGiftRecipient(
      buyerAccountId: String,
      deliveryAddress: Option[Address],
      giftRecipient: GiftRecipient,
  ) = {
    val (email, title) = giftRecipient match {
      case w: GiftRecipient.WeeklyGiftRecipient => (w.email, w.title)
      case ds: GiftRecipient.DigitalSubscriptionGiftRecipient => (Some(ds.email), None)
    }
    DeliveryContact(
      AccountId = buyerAccountId,
      Email = email,
      Salutation = title,
      FirstName = giftRecipient.firstName,
      LastName = giftRecipient.lastName,
      MailingStreet = deliveryAddress.flatMap(getAddressLine),
      MailingCity = deliveryAddress.flatMap(_.city),
      MailingState = deliveryAddress.flatMap(_.state),
      MailingPostalCode = deliveryAddress.flatMap(_.postCode),
      MailingCountry = deliveryAddress.map(_.country.name),
    )
  }
}

/** The AuthService object is responsible for ensuring that we have a valid authentication token for Salesforce. The
  * first time it is asked for an authentication token it will go off and fetch one and then store the result in authRef
  * (one auth token per stage). It also checks the token every time it is used to see whether it has become stale - a
  * problem we have apparently seen in the past despite Salesforce telling us that tokens should be valid for 12hrs. If
  * the token is stale a new one is fetched
  */
object AuthService extends SafeLogging {

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
    logger.info(s"Successfully retrieved Salesforce authentication token for $stage")
    val newAuths = authRef().updated(stage, authentication)
    authRef() = newAuths
  }
}

class AuthService(config: SalesforceConfig)(implicit ec: ExecutionContext)
    extends WebServiceHelper[SalesforceAuthenticationErrorResponse] {
  val sfConfig: SalesforceConfig = config
  val wsUrl: String = sfConfig.url
  val httpClient: FutureHttpClient = RequestRunners.configurableFutureRunner(10.seconds)

  def authorize: Future[Authentication] = {
    logger.info(s"Trying to authenticate with Salesforce ${Configuration.stage}...")

    def postAuthRequest: Future[Authentication] =
      postForm[Authentication](
        "services/oauth2/token",
        Map(
          "client_id" -> Seq(sfConfig.key),
          "client_secret" -> Seq(sfConfig.secret),
          "username" -> Seq(sfConfig.username),
          "password" -> Seq(sfConfig.password + sfConfig.token),
          "grant_type" -> Seq("password"),
        ),
      )

    postAuthRequest
  }
}
