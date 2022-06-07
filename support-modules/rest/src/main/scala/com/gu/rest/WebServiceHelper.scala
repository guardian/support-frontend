package com.gu.rest

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

sealed abstract class WebServiceHelperErrorBase(
    message: String,
    cause: Throwable = None.orNull,
) extends Throwable(message, cause)

case class WebServiceHelperError[T: ClassTag](
    codeBody: CodeBody,
    message: String,
    cause: Throwable = None.orNull,
) extends WebServiceHelperErrorBase(message, cause) {
  override def getMessage: String = s"${classTag[T]} - $message: ${codeBody.getMessage}"
}

case class WebServiceClientError(codeBody: CodeBody) extends WebServiceHelperErrorBase(codeBody.getMessage) {
  override def getMessage: String = codeBody.getMessage
}

case class CodeBody(code: String, body: String) {
  def getMessage: String = s"$code: $body"
}

/** A wrapper for a JSON web service. It automatically converts the response to a solid type, or handles and logs the
  * error.
  *
  * @tparam Error
  *   The type that will attempt to be extracted if extracting the expected object fails. This is useful when a web
  *   service has a standard error format
  */
trait WebServiceHelper[Error <: Throwable] {
  val wsUrl: String
  val httpClient: FutureHttpClient

  private type ParamMap = Map[String, String]

  private def urlBuilder = HttpUrl.parse(wsUrl).newBuilder()

  /** Manipulate the request before it is executed. Generally used to add any authentication settings the web services
    * requires (e.g. add an Authentication header)
    *
    * @param req
    *   The request
    * @return
    *   The modified request
    */
  def wsPreExecute(req: Request.Builder): Future[Request.Builder] = Future.successful(req)

  /** Send a request to the web service and attempt to convert the response to an A
    *
    * @param rb
    *   The request to send
    * @param decoder
    *   A Decoder to convert JSON to A
    * @param errorDecoder
    *   A Decoder to convert JSON to Error
    * @tparam A
    *   The type of the object that is expected to be returned from the request
    * @return
    */
  private def request[A](
      rb: Request.Builder,
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    for {
      response <- getResponse(rb)
      codeBody <- Future.fromTry(getJsonBody(response))
      decodedResponse <- Future.fromTry(decodeBody[A](codeBody))
    } yield decodedResponse

  }

  protected def getResponse(rb: Request.Builder) = for {
    req <- wsPreExecute(rb).map(_.build())
    _ = SafeLogger.info(s"Issuing request ${req.method} ${req.url}")
    response <- httpClient(req)
  } yield response

  def getJsonBody[A](response: Response)(implicit ctag: ClassTag[A]): Try[CodeBody] = {
    val code = response.code().toString
    for {
      body <- Option(response.body).toRight(WebServiceHelperError(CodeBody(code, ""), "no body")).toTry
      contentType <- Option(body.contentType())
        .toRight(WebServiceHelperError(CodeBody(code, ""), "no content type"))
        .toTry
      responseBody <- Try(body.string())
      codeBody = CodeBody(code, responseBody)
      _ = SafeLogger.info(s"response $code body: ${responseBody.replace("\n", "")}")
      _ <-
        if ((contentType.`type`(), contentType.subtype()) == ("application", "json")) Success(())
        else Failure(WebServiceHelperError(codeBody, s"wrong content type"))
    } yield codeBody
  }

  def decodeBody[A](codeBody: CodeBody)(implicit
      decoder: Decoder[A],
      errorDecoder: Decoder[Error],
      ctag: ClassTag[A],
  ): Try[A] = {

    val CodeBody(code, responseBody) = codeBody
    val responseFamily = code(0) + "xx"
    responseFamily match {
      case "2xx" =>
        decode[A](responseBody).left.map { err =>
          decodeError(responseBody).right.getOrElse(
            WebServiceHelperError[A](
              codeBody,
              s"failed to parse response. Error was: $err, Response was: $responseBody",
              err,
            ),
          )
        }.toTry
      case "4xx" =>
        Failure(decodeError(responseBody).right.toOption.getOrElse(WebServiceClientError(codeBody)))
      case statusCode =>
        Failure(WebServiceHelperError[A](codeBody, s"unrecognised response code $statusCode"))
    }

  }

  /** Allow subclasses to customise the way errors are decoded
    *
    * @param responseBody
    * @param errorDecoder
    * @return
    *   Either[circe.Error, Error]
    */
  def decodeError(responseBody: String)(implicit errorDecoder: Decoder[Error]): Either[circe.Error, Error] =
    decode[Error](responseBody)

  def get[A](
      endpoint: String,
      headers: ParamMap = empty,
      params: ParamMap = empty,
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): Future[A] =
    request[A](buildRequest(endpoint, headers, params))

  def postJson[A](
      endpoint: String,
      data: Json,
      headers: ParamMap = empty,
      params: ParamMap = empty,
  )(implicit reads: Decoder[A], error: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    val json = data.printWith(Printer.noSpaces.copy(dropNullValues = true))
    SafeLogger.info(s"Issuing request POST $endpoint $json")
    val body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json)
    request[A](buildRequest(endpoint, headers, params).post(body))
  }

  def putJson[A](
      endpoint: String,
      data: Json,
      headers: ParamMap = empty,
      params: ParamMap = empty,
  )(implicit reads: Decoder[A], error: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    val json = data.printWith(Printer.noSpaces.copy(dropNullValues = true))
    SafeLogger.info(s"Issuing request PUT $endpoint $json")
    val body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json)
    request[A](buildRequest(endpoint, headers, params).put(body))
  }

  def postForm[A](
      endpoint: String,
      data: Map[String, Seq[String]],
      headers: ParamMap = empty,
      params: ParamMap = empty,
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): Future[A] = {
    val postParams = data
      .foldLeft(new FormBody.Builder()) { case (p, (name, values)) =>
        val paramName = if (values.size > 1) s"$name[]" else name
        values.foldLeft(p) { case (ps, value) => ps.add(paramName, value) }
      }
      .build()
    request[A](buildRequest(endpoint, headers, params).post(postParams))
  }
  // scalastyle:on line.size.limit

  protected def buildRequest(endpoint: String, headers: ParamMap, params: ParamMap): Request.Builder =
    new Request.Builder()
      .url(endpointUrl(endpoint, params))
      .headers(buildHeaders(headers))

  private def endpointUrl(endpoint: String, params: ParamMap): HttpUrl = {
    val withSegments = endpoint.split("/", -1).foldLeft(urlBuilder) { case (url, segment) =>
      url.addEncodedPathSegment(segment)
    }
    params
      .foldLeft(withSegments) { case (url, (k, v)) =>
        url.addQueryParameter(k, v)
      }
      .build()
  }

  private def buildHeaders(headers: ParamMap) =
    headers
      .foldLeft(new Headers.Builder()) { case (h, (k, v)) =>
        h.add(k, v)
      }
      .build()

}
