package com.gu.helpers

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.{Decoder, Json}
import okhttp3._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.reflect.{ClassTag, classTag}

case class WebServiceHelperError[T: ClassTag](responseCode: Int, responseBody: String) extends Throwable {
  override def getMessage: String = s"${classTag[T]} - $responseCode: $responseBody"
}

case class RequestDecoders[A, B](decoder: Decoder[A], errorDecoder: Decoder[B], ctag: ClassTag[A])

object RequestDecoders {
  implicit def requestContext[A, Error <: Throwable](implicit decoder: Decoder[A], errorDecoder: Decoder[Error], ctag: ClassTag[A]): RequestDecoders[A, Error] =
    RequestDecoders(decoder, errorDecoder, ctag)

  implicit def decoderFromContext[A, Error <: Throwable](implicit context: RequestDecoders[A, Error]): Decoder[A] =
    context.decoder

  implicit def errorDecoderFromContext[A, Error <: Throwable](implicit context: RequestDecoders[A, Error]): Decoder[Error] =
    context.errorDecoder

  implicit def ctagFromContext[A, Error <: Throwable](implicit context: RequestDecoders[A, Error]): ClassTag[A] =
    context.ctag
}

/**
 * A wrapper for a JSON web service. It automatically converts the response to a solid type, or
 * handles and logs the error.
 *
 * @tparam T The base type of all the objects that this WebServiceHelper can return
 * @tparam Error The type that will attempt to be extracted if extracting the expected object fails.
 *               This is useful when a web service has a standard error format
 */
trait WebServiceHelper[T, Error <: Throwable] extends LazyLogging {
  import RequestDecoders._

  val wsUrl: String
  val httpClient: FutureHttpClient
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
   * @param rb The request to send
   * @param decoders A Decoder to convert JSON to A, A Decoder to convert JSON to Error
   * @return
   */
  private def request[A <: T](rb: Request.Builder)(implicit decoders: RequestDecoders[A, Error]): Future[A] = {
    val req = wsPreExecute(rb).build()
    logger.debug(s"Issuing request ${req.method} ${req.url}")
    // The string provided here sets the Custom Metric Name for the http request in CloudWatch
    for {
      response <- httpClient(req)
    } yield {
      val responseBody = response.body.string()
      logger.debug(s"$responseBody")
      decode[A](responseBody)(decoders.decoder) match  {
        case Left(err) => throw decode[Error](responseBody)(decoders.errorDecoder).right.getOrElse(WebServiceHelperError[A](response.code(), responseBody))
        case Right(value) => value
      }
    }
  }

  def get[A <: T](endpoint: String, params: (String, String)*)(implicit decoders: RequestDecoders[A, Error]): Future[A] =
    request(new Request.Builder().url(endpointUrl(endpoint, params)))

  def post[A <: T](endpoint: String, data: Json, params: (String, String)*)(implicit decoders: RequestDecoders[A, Error]): Future[A] = {
    val body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), data.noSpaces)
    request(new Request.Builder().url(endpointUrl(endpoint, params)).post(body))
  }

  def post[A <: T](endpoint: String, data: Map[String, Seq[String]])(implicit decoders: RequestDecoders[A, Error]): Future[A] = {
    val postParams = data.foldLeft(new FormBody.Builder()) { case (params, (name, values)) =>
      val paramName = if (values.size > 1) s"$name[]" else name
      values.foldLeft(params){ case (ps, value) => ps.add(paramName, value) }
    }.build()

    request(new Request.Builder().url(endpointUrl(endpoint)).post(postParams))
  }

  private def endpointUrl(endpoint: String, params: Seq[(String, String)] = Seq.empty): HttpUrl = {
    val withSegments = endpoint.split("/").foldLeft(urlBuilder) { case (url, segment) =>
      url.addEncodedPathSegment(segment)
    }
    params.foldLeft(withSegments) { case (url, (k, v)) =>
      url.addQueryParameter(k, v)
    }.build()
  }

}
