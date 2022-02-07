package com.gu.stripeIntent

import java.io.ByteArrayInputStream
import java.util.{Map => JavaMap}

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.lambda.runtime._
import com.gu.handler._
import com.gu.handler.impure.S3Loader
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{Stage, Stages}
import com.typesafe.config.{ConfigFactory, ConfigValue}
import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

import scala.jdk.CollectionConverters._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

// DTOs for http req/resp bodies
case class RequestBody(publicKey: String)
case class ResponseBody(client_secret: String)
case class ErrorBody(message: String)

object RequestBody {
  implicit val decoder: Decoder[RequestBody] = deriveDecoder
}
object ResponseBody {
  implicit val encoder: Encoder[ResponseBody] = deriveEncoder
}
object ErrorBody {
  implicit val encoder: Encoder[ErrorBody] = deriveEncoder
}

// simplest possible data structure to minimise external dependencies/side effects and be easy to mock
case class StripeIntentEnv(
    stage: Stage,
    mappings: Map[StripePublicKey, StripePrivateKey],
    futureHttpClient: FutureHttpClient, // would be easier to mock a function that didn't use OKHttp types
)

case class StripePublicKey(value: String)
case class StripePrivateKey(value: String)

object Handler extends ApiGatewayHandler[RequestBody, StripeIntentEnv] {

  override def lambdaBody(handlerEffects: StripeIntentEnv, input: RequestBody): Future[ApiGatewayResponse] = {
    val stripePublicKey = StripePublicKey(input.publicKey)
    val result: EitherT[Future, ApiGatewayResponse, ApiGatewayResponse] =
      for {
        privateKey <- handlerEffects.mappings
          .get(stripePublicKey)
          .toRight(badRequestPublicKey(handlerEffects.stage))
          .toEitherT[Future]
        stripeService = new StripeService(privateKey, handlerEffects.futureHttpClient)
        getIntent = getStripeSetupIntent(stripeService) _
        intent <- EitherT.right(getIntent())
      } yield okSetupIntent(intent.client_secret, handlerEffects.stage)
    result.value.map(_.fold(identity, identity))
  }

  def okSetupIntent(client_secret: String, stage: Stage): ApiGatewayResponse =
    ApiGatewayResponse(200, ResponseBody(client_secret), stage)
  def badRequestPublicKey(stage: Stage): ApiGatewayResponse =
    ApiGatewayResponse(400, ErrorBody("public key not known"), stage)

  override def minimalEnvironment(): StripeIntentEnv = {
    val stage = Stage.fromString(Option(System.getenv("Stage")).filter(_ != "").getOrElse("DEV")).getOrElse(Stages.DEV)
    val stripeKeys = getRealConfig(stage)

    StripeIntentEnv(stage, stripeKeys, RequestRunners.configurableFutureRunner(30.seconds))
  }

  def getRealConfig(stage: Stage): Map[StripePublicKey, StripePrivateKey] = {
    val config = S3Loader
      .load(StripeConfigPath.apply(stage))
    val stripeKeys = config
      .getObject("mappings")
      .entrySet()
      .asScala
      .toSet
      .map { entry: JavaMap.Entry[String, ConfigValue] =>
        (StripePublicKey(entry.getKey), StripePrivateKey(entry.getValue.unwrapped().asInstanceOf[String]))
      }
      .toMap

    stripeKeys
  }
}
