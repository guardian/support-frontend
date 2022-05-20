package com.gu.patrons.services

import cats.data.OptionT
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.patrons.conf.PatronsIdentityConfig
import com.gu.patrons.model.identity._
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import scala.concurrent.{ExecutionContext, Future}

class PatronsIdentityService(val config: PatronsIdentityConfig, client: FutureHttpClient)
    extends WebServiceHelper[IdentityErrorResponse] {
  override val wsUrl = config.apiUrl
  override val httpClient = client
  val authHeader = Map(
    "Authorization" -> s"Bearer ${config.apiClientToken}",
  )

  def getOrCreateUserFromEmail(
      email: String,
      firstName: Option[String],
  )(implicit ec: ExecutionContext): Future[String] = {
    OptionT(getUserIdFromEmail(email))
      .getOrElseF(createUserIdFromEmailUser(email, firstName))
  }

  def getUserIdFromEmail(
      email: String,
  )(implicit ec: ExecutionContext): Future[Option[String]] =
    get[UserResponse](
      "user",
      Map("X-GU-ID-Client-Access-Token" -> s"Bearer ${config.apiClientToken}"),
      Map("emailAddress" -> email),
    ).map(response => Some(response.user.id))
      .recover {
        case err: IdentityErrorResponse if err.errors.headOption.map(_.message).contains("Not found") =>
          None
      }

  def createUserIdFromEmailUser(
      email: String,
      firstName: Option[String],
  )(implicit ec: ExecutionContext) = {
    val body = CreateGuestAccountRequestBody(
      email,
      PrivateFields(
        firstName = firstName.getOrElse(""),
        secondName = "",
      ),
    )
    postJson[GuestRegistrationResponse](
      "guest",
      body.asJson,
      Map("X-GU-ID-Client-Access-Token" -> s"Bearer ${config.apiClientToken}"),
      Map("accountVerificationEmail" -> "true"),
    ).map(response => response.guestRegistrationRequest.userId)

  }
}
