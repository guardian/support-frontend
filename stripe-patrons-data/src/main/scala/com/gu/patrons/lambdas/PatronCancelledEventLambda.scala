package com.gu.patrons.lambdas

import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.gu.monitoring.SafeLogger
import com.gu.patrons.conf.PatronsStripeConfig
import com.gu.patrons.model.{Error, InvalidRequestError, StageConstructors}
import com.stripe.net.Webhook
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.{Duration, MILLISECONDS, MINUTES}
import scala.jdk.CollectionConverters.MapHasAsScala
import scala.util.Try

object PatronCancelledEventLambda {

  def handleRequest(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    val response = new APIGatewayProxyResponseEvent()
    val stage = StageConstructors.fromEnvironment
    SafeLogger.info(s"Stage is $stage")
    SafeLogger.info(s"Path is ${event.getPathParameters.get("countryId")}")

    Await.result(
      PatronsStripeConfig.fromParameterStore(stage).map { config =>
        SafeLogger.info(s"signing secret is ${config.signingSecret}")
        val payload = getPayload(event, config.signingSecret)
      },
      Duration(15, MINUTES),
    )

    response.setStatusCode(200)
    response
  }

  def getPayload(event: APIGatewayProxyRequestEvent, signingSecret: String): Either[Error, String] =
    for {
      payload <- Option(event.getBody()).toRight(InvalidRequestError("Missing body"))
      _ = SafeLogger.info(s"payload is $payload")
      sigHeader <- event.getHeaders.asScala.get("Stripe-Signature").toRight(InvalidRequestError("Missing sig header"))
      _ <- Try(Webhook.Signature.verifyHeader(payload, sigHeader, signingSecret, 300)).toEither.left.map(e =>
        InvalidRequestError(e.getMessage()),
      )
      _ = SafeLogger.info(s"payload successfully verified")
    } yield payload

}

case class PatronCancelledEvent(data: PatronCancelledData, `type`: String)
object PatronCancelledEvent {
  implicit val decoder: Decoder[PatronCancelledEvent] = deriveDecoder
  implicit val dataDecoder: Decoder[PatronCancelledData] = deriveDecoder
  implicit val objectDecoder: Decoder[PatronCancelledObject] = deriveDecoder
}
case class PatronCancelledData(`object`: PatronCancelledObject)
case class PatronCancelledObject(customer: String)
