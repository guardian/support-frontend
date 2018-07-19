package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.emailservices.{EmailService, FailedContributionEmailFields}
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.Fixtures.{cardDeclinedJsonStripe, cardDeclinedJsonZuora, failureJson, oldSchemaFailureJson}
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.encoding.StateCodecs.completedStateCodec
import com.gu.support.workers.model.states.CompletedState
import com.gu.support.workers.model.{JsonWrapper, Status}
import com.gu.support.workers.{Fixtures, LambdaSpec}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.encoding.CustomCodecs._
import com.gu.zuora.model.response.{ZuoraError, ZuoraErrorResponse}
import io.circe.parser.decode

import scala.concurrent.ExecutionContext.Implicits.global
import scala.io.Source

@IntegrationTest
class FailureHandlerSpec extends LambdaSpec {

  "EmailService" should "send a failure email" in {
    val service = new EmailService
    val email = "rupert.bates@theguardian.com"
    service
      .send(FailedContributionEmailFields(email))
      .map(result => result.getMessageId should not be "")
  }

  "FailureHandler lambda" should "return a failed JsonWrapper for any errors except payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(failureJson.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(true)
  }

  "FailureHandler lambda" should "still return a failed JsonWrapper if it receives the old schema" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(oldSchemaFailureJson.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(true)
  }

  it should "return a non failed JsonWrapper for Zuora payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonZuora.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(false)
    SafeLogger.info(outState.right.get.requestInfo.messages.head)
  }

  it should "return a non failed JsonWrapper for Stripe payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonStripe.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(false)
    SafeLogger.info(outState.right.get.requestInfo.messages.head)
  }

  it should "return a Status.Failure for a Zuora card declined error" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonZuora.asInputStream, outStream, context)

    val outState = Encoding.in[CompletedState](outStream.toInputStream)
    outState.isSuccess should be(true)
    outState.get._1.status should be(Status.Failure)
  }

  it should "match a transaction declined error" in {
    val errorResponse = Some(ZuoraErrorResponse(success = false, decode[List[ZuoraError]](Fixtures.zuoraErrorResponse).right.get))

    errorResponse match {
      case Some(ZuoraErrorResponse(_, List(ZuoraError("TRANSACTION_FAILED", _)))) => succeed
      case _ => fail()
    }
  }
}
