package com.gu.patrons.services

import cats.data.OptionT
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
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
    SafeLogger.info(s"Attempting to find identity id for user $email")
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
    ).map { response =>
      SafeLogger.info(s"Found identity id ${response.user.id} for email $email")
      Some(response.user.id)
    }.recover {
      case err: IdentityErrorResponse if err.errors.headOption.map(_.message).contains("Not found") =>
        SafeLogger.info(s"Email address $email not found in Identity")
        None
    }

  def createUserIdFromEmailUser(
      email: String,
      firstName: Option[String],
  )(implicit ec: ExecutionContext) = {
    SafeLogger.info(s"Attempting to create guest identity account for user $email")
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
    ).map { response =>
      SafeLogger.info(s"Created account with identity id ${response.guestRegistrationRequest.userId} for email $email")
      response.guestRegistrationRequest.userId
    }.recover { err =>
      SafeLogger.error(
        scrub"Received an error from Identity while trying to create guest identity account for $email",
        err,
      )
      throw err
    }

  }
}
