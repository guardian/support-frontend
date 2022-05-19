package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.patrons.conf.PatronsIdentityConfig
import com.gu.patrons.model.identity._
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import scala.concurrent.ExecutionContext

class PatronsIdentityService(val config: PatronsIdentityConfig, client: FutureHttpClient)
    extends WebServiceHelper[IdentityErrorResponse] {
  override val wsUrl = config.apiUrl
  override val httpClient = client
  val authHeader = Map(
    "Authorization" -> s"Bearer ${config.apiClientToken}",
  )

  def getOrCreateUserFromEmail(
      email: String,
      firstName: String,
      lastName: String,
  )(implicit ec: ExecutionContext) = {
    getUserIdFromEmail(email)
      .recoverWith {
        case err: IdentityErrorResponse if err.errors.headOption.map(_.message).contains("Not found") =>
          createUserIdFromEmailUser(email, firstName, lastName)
      }
  }

  def getUserIdFromEmail(
      email: String,
  )(implicit ec: ExecutionContext) =
    get[UserResponse](
      "user",
      Map("X-GU-ID-Client-Access-Token" -> s"Bearer ${config.apiClientToken}"),
      Map("emailAddress" -> email),
    ).map(_.user.id)

  def createUserIdFromEmailUser(
      email: String,
      firstName: String,
      lastName: String,
  )(implicit ec: ExecutionContext) = {
    val body = CreateGuestAccountRequestBody(
      email,
      PrivateFields(
        firstName = firstName,
        secondName = lastName,
      ),
    )
    postJson[GuestRegistrationResponse](
      "guest",
      body.asJson,
      Map("X-GU-ID-Client-Access-Token" -> s"Bearer ${config.apiClientToken}"),
      Map("accountVerificationEmail" -> "true"),
    ).map(_.guestRegistrationRequest.userId)
  }
}
