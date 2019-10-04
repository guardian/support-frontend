package com.gu.handler

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.concurrent.{ExecutionContext, Future}

case class ApiGatewayRequest(
  body: String,
)

object ApiGatewayRequest {
  implicit val decoder: Decoder[ApiGatewayRequest] = deriveDecoder
}

case class HeadersDTO(contentType: String = "application/json")

case class ApiGatewayResponse private (statusCode: String, body: String, headers: Map[String, String])

object ApiGatewayResponse {
  def apply[Response: Encoder](httpResponseCode: HttpResponseCode, response: Response) =
    new ApiGatewayResponse(httpResponseCode.value, response.asJson.noSpaces, Map("contentType" -> "application/json"))
  implicit val encoder: Encoder[ApiGatewayResponse] = deriveEncoder
}

sealed abstract class HttpResponseCode(val value: String)
case object BadRequest extends HttpResponseCode("400")
case object Ok extends HttpResponseCode("200")

abstract class ApiGatewayHandler[Request: Decoder, Environment](implicit executionContext: ExecutionContext) extends JsonLambda[ApiGatewayRequest, Environment] {

  // should not change any global state
  def lambdaBody(environment: Environment, input: Request): Future[ApiGatewayResponse]
  override def lambdaApiGateway(environment: Environment, inputData: ApiGatewayRequest): Future[ApiGatewayResponse] =
    for {
      inputData <- Future.fromTry(decode[Request](inputData.body).toTry).withLogging("START ")
      result <- lambdaBody(environment, inputData).withLogging("FINISH")
    } yield result

}
