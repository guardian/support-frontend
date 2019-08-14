package com.gu.helpers

import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.FutureHttpClient
import io.circe
import io.circe.parser._
import io.circe.{Decoder, Json, Printer}
import okhttp3._

import scala.collection.immutable.Map.empty
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.reflect.{ClassTag, classTag}
import scala.util.{Failure, Success, Try}

sealed abstract class WebServiceHelperErrorBase(responseCode: String, responseBody: String) extends Throwable

case class WebServiceHelperError[T: ClassTag](
  responseCode: String,
  responseBody: String,
  message: String
) extends WebServiceHelperErrorBase(responseCode, responseBody) {
  override def getMessage: String = s"${classTag[T]} - $message: $responseCode: $responseBody"
}

case class WebServiceClientError(
  responseCode: String,
  responseBody: String
) extends WebServiceHelperErrorBase(responseCode, responseBody) {
  override def getMessage: String = s"$responseCode: $responseBody"
}

/**
 * A wrapper for a JSON web service. It automatically converts the response to a solid type, or
 * handles and logs the error.
 *
 * @tparam Error The type that will attempt to be extracted if extracting the expected object fails.
 *               This is useful when a web service has a standard error format
 */
trait WebServiceHelper[Error <: Throwable] {
  val wsUrl: String
  val httpClient: FutureHttpClient

  private type ParamMap = Map[String, String]

  private def urlBuilder = HttpUrl.parse(wsUrl).newBuilder()

  /**
   * Manipulate the request before it is executed. Generally used to add any authentication settings
   * the web services requires (e.g. add an Authentication header)
   *
   * @param req The request
   * @return The modified request
   */
  def wsPreExecute(req: Request.Builder): Request.Builder = req

  /**
   * Send a request to the web service and attempt to convert the response to an A
   *
   * @param rb           The request to send
   * @param decoder      A Decoder to convert JSON to A
   * @param errorDecoder A Decoder to convert JSON to Error
   * @tparam A The type of the object that is expected to be returned from the request
   * @return
   */
  private def request[A](rb: Request.Builder)(implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    val req = wsPreExecute(rb).build()
    SafeLogger.info(s"Issuing request ${req.method} ${req.url}")
    for {
      response <- httpClient(req)
      decodedResponse <- {
        val code = response.code().toString
        val failableDecodedResponse = for {
          body <- Option(response.body).toRight(WebServiceHelperError(code, "", "no body")).toTry
          contentType <- Option(body.contentType()).toRight(WebServiceHelperError(code, "", "no content type")).toTry
          bodyString <- Try(body.string())
          _ = SafeLogger.info(s"response $code body: ${bodyString.length} bytes")
          _ <- if (contentType.`type`() == "application" && contentType.subtype() == "json") Success(())
          else Failure(WebServiceHelperError(code, bodyString, s"wrong content type"))
          result <- code.splitAt(1) match {
            case ("2", _) => decode[A](bodyString).left.map { err =>
              WebServiceHelperError[A](code, bodyString, s"failed to parse response: $err")
            }.toTry
            case ("4", _) => Failure((decodeError(bodyString).right.toOption).getOrElse(
              WebServiceClientError(code, bodyString))
            )
            case _ => Failure(WebServiceHelperError[A](code, bodyString, "unrecognised response code"))
          }
        } yield result
        Future.fromTry(failableDecodedResponse)
      }
    } yield decodedResponse

  }

  /**
   * Allow subclasses to customise the way errors are decoded
   *
   * @param responseBody
   * @param errorDecoder
   * @return Either[circe.Error, Error]
   */
  def decodeError(responseBody: String)(implicit errorDecoder: Decoder[Error]): Either[circe.Error, Error] = decode[Error](responseBody)

  //Scalariform won't let you add a line break in method signatures, but then scalaStyle freaks out because they're too long
  // scalastyle:off line.size.limit
  def get[A](endpoint: String, headers: ParamMap = empty, params: ParamMap = empty)(implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): Future[A] =
    request[A](buildRequest(endpoint, headers, params))

  def postJson[A](endpoint: String, data: Json, headers: ParamMap = empty, params: ParamMap = empty)(implicit reads: Decoder[A], error: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    val json = data.pretty(Printer.noSpaces.copy(dropNullValues = true))
    val body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json)
    request[A](buildRequest(endpoint, headers, params).post(body))
  }

  def postForm[A](endpoint: String, data: Map[String, Seq[String]], headers: ParamMap = empty, params: ParamMap = empty)(implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    val postParams = data.foldLeft(new FormBody.Builder()) {
      case (p, (name, values)) =>
        val paramName = if (values.size > 1) s"$name[]" else name
        values.foldLeft(p) { case (ps, value) => ps.add(paramName, value) }
    }.build()
    request[A](buildRequest(endpoint, headers, params).post(postParams))
  }
  // scalastyle:on line.size.limit

  private def buildRequest(endpoint: String, headers: ParamMap, params: ParamMap) =
    new Request.Builder()
      .url(endpointUrl(endpoint, params))
      .headers(buildHeaders(headers))

  private def endpointUrl(endpoint: String, params: ParamMap): HttpUrl = {
    val withSegments = endpoint.split("/").foldLeft(urlBuilder) {
      case (url, segment) =>
        url.addEncodedPathSegment(segment)
    }
    params.foldLeft(withSegments) {
      case (url, (k, v)) =>
        url.addQueryParameter(k, v)
    }.build()
  }

  private def buildHeaders(headers: ParamMap) =
    headers.foldLeft(new Headers.Builder()) {
      case (h, (k, v)) =>
        h.add(k, v)
    }.build()

}
