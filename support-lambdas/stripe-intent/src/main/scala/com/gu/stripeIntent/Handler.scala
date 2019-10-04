package com.gu.stripeIntent

import java.io.ByteArrayInputStream
import java.util.{Map => JavaMap}

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.lambda.runtime._
import com.gu.handler._
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{Stage, Stages}
import com.typesafe.config.{ConfigFactory, ConfigValue}
import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

import scala.collection.JavaConverters._
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
  mappings: Map[StripePublicKey, StripePrivateKey],
  futureHttpClient: FutureHttpClient // would be easier to mock a function `Req => Future[Resp]`
)

case class StripePublicKey(value: String)
case class StripePrivateKey(value: String)

object Handler extends ApiGatewayHandler[RequestBody, StripeIntentEnv] {

  override def lambdaBody(handlerEffects: StripeIntentEnv, input: RequestBody): Future[ApiGatewayResponse] = {
    val stripePublicKey = StripePublicKey(input.publicKey)
    val result: EitherT[Future, ApiGatewayResponse, ApiGatewayResponse] =
      for {
        privateKey <- handlerEffects.mappings.get(stripePublicKey).toRight(badRequestPublicKey).toEitherT[Future]
        stripeService = new StripeService(privateKey, handlerEffects.futureHttpClient)
        getIntent = getStripeSetupIntent(stripeService) _
        intent <- EitherT.right(getIntent())
      } yield okSetupIntent(intent.client_secret)
    result.value.map(_.fold(identity, identity))
  }

  def okSetupIntent(client_secret: String): ApiGatewayResponse = ApiGatewayResponse(Ok, ResponseBody(client_secret))
  val badRequestPublicKey: ApiGatewayResponse = ApiGatewayResponse(BadRequest, ErrorBody("public key not known"))

  override def minimalEnvironment(): StripeIntentEnv = {
    val stage = Stage.fromString(Option(System.getenv("Stage")).filter(_ != "").getOrElse("DEV")).getOrElse(Stages.DEV)
    val config = S3Loader
      .load(StripeConfigPath(stage), ConfigFactory.load())
    val stripeKeys = config.getObject("mappings").entrySet().asScala.toSet.map { entry: JavaMap.Entry[String, ConfigValue] =>
      (StripePublicKey(entry.getKey), StripePrivateKey(entry.getValue.unwrapped().asInstanceOf[String]))
    }.toMap

    StripeIntentEnv(stripeKeys, RequestRunners.configurableFutureRunner(30.seconds))
  }

}









object ManualTest {
  // just a handy way to invoke the lambda locally
  def main(args: Array[String]): Unit = {
    val publicKey = args.headOption.getOrElse("invalidkey")
    val jsonRequest = s"""{"body": "{ \\"publicKey\\": \\"${publicKey}\\" }"}"""
    Handler.handleRequest(new ByteArrayInputStream(jsonRequest.getBytes("UTF-8")),
      System.out, new Context {
        override def getAwsRequestId: String = ???

        override def getLogGroupName: String = ???

        override def getLogStreamName: String = ???

        override def getFunctionName: String = ???

        override def getFunctionVersion: String = ???

        override def getInvokedFunctionArn: String = ???

        override def getIdentity: CognitoIdentity = ???

        override def getClientContext: ClientContext = ???

        override def getRemainingTimeInMillis: Int = 30000

        override def getMemoryLimitInMB: Int = ???

        override def getLogger: LambdaLogger = ???
      })
  }

}

