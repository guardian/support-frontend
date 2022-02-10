package com.gu.okhttp

import java.util.concurrent.TimeUnit

import com.typesafe.scalalogging.LazyLogging
import okhttp3.{OkHttpClient, Protocol, Request, Response => OkResponse}

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds
import scala.collection.JavaConverters._

/** These are functions from an OkHttpRequest to an M[Response] which are passed into Clients (such as SimpleClient), to
  * determine how they process HTTP requests
  */
object RequestRunners extends LazyLogging {
  lazy val client = new OkHttpClient()
  type FutureHttpClient = Request => Future[OkResponse]

  /** Standard no frills run this request and return a response asynchronously A solid choice for the beginner
    * SimpleClient user
    */
  def futureRunner(implicit ec: ExecutionContext): Request => Future[OkResponse] =
    client.execute

  /** Adjusts the standard client used in futureRunner to use a configurable read timeout setting, see:
    * https://github.com/square/okhttp/wiki/Recipes#timeouts
    */
  def configurableFutureRunner(timeout: Duration)(implicit ec: ExecutionContext): Request => Future[OkResponse] = {
    val millis: Int = timeout.toMillis.toInt
    client
      .newBuilder()
      .readTimeout(millis, TimeUnit.MILLISECONDS)
      .writeTimeout(millis, TimeUnit.MILLISECONDS)
      .connectTimeout(millis, TimeUnit.MILLISECONDS)
      .build()
      .execute
  }
}
