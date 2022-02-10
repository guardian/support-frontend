package com.gu.handler

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import io.circe.Decoder
import io.circe.parser.decode
import io.circe.syntax._

import scala.concurrent.duration.{Duration, MILLISECONDS}
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.io.Source
import scala.util.Try

abstract class JsonLambda[Request: Decoder, Environment](implicit executionContext: ExecutionContext)
    extends RequestStreamHandler
    with LogImplicit {

  // stuff that makes minimal view of the outside world goes in here
  def minimalEnvironment(): Environment

  def lambdaApiGateway(environment: Environment, inputData: ApiGatewayRequest): Future[ApiGatewayResponse]

  def lambdaString(environment: Environment, is: String): Future[String] =
    for {
      inputData <- Future.fromTry(decode[ApiGatewayRequest](is).toTry).withLogging("START ")
      result <- lambdaApiGateway(environment, inputData).withLogging("FINISH")
    } yield result.asJson.noSpaces

  override def handleRequest(input: InputStream, output: OutputStream, context: Context): Unit = {
    val ioStreamAttempt = Try(Source.fromInputStream(input).mkString) flatMap { inputString =>
      input.close()
      val environment = minimalEnvironment()
      val outputString = Await.result(
        lambdaString(environment, inputString),
        Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS),
      )
      val t = Try(output.write(outputString.getBytes()))
      output.close()
      t
    }
    ioStreamAttempt.recover { case t =>
      SafeLogger.error(scrub"Lambda failed with exception", t)
      throw t
    }
  }

}
