package com.gu.handler

import com.gu.support.config.{Stage, Stages}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.concurrent.{ExecutionContext, Future}

case class ApiGatewayRequest(body: String)

object ApiGatewayRequest {
  implicit val decoder: Decoder[ApiGatewayRequest] = deriveDecoder
}

case class ApiGatewayHeaders(contentType: String = "application/json")

case class ApiGatewayResponse private (statusCode: Int, body: String, headers: Map[String, String])

object ApiGatewayResponse {
  private def headers(stage: Stage): Map[String, String] = Map(
    "Content-Type" -> "application/json",
    "Access-Control-Allow-Origin" -> (if (stage == Stages.PROD) "https://support.theguardian.com" else "*"),
    "Access-Control-Allow-Headers" -> "*",
    "Access-Control-Allow-Methods" -> "*",
  )

  def apply[Response: Encoder](httpResponseCode: Int, response: Response, stage: Stage): ApiGatewayResponse =
    new ApiGatewayResponse(httpResponseCode, response.asJson.noSpaces, headers(stage))
  implicit val encoder: Encoder[ApiGatewayResponse] = deriveEncoder
}

abstract class ApiGatewayHandler[Request: Decoder, Environment](implicit
    executionContext: ExecutionContext,
) extends JsonLambda[ApiGatewayRequest, Environment] {

  // should not change any global state
  def lambdaBody(environment: Environment, input: Request): Future[ApiGatewayResponse]
  override def lambdaApiGateway(environment: Environment, inputData: ApiGatewayRequest): Future[ApiGatewayResponse] =
    for {
      inputData <- Future.fromTry(decode[Request](inputData.body).toTry).withLogging("START ")
      result <- lambdaBody(environment, inputData).withLogging("FINISH")
    } yield result

}
