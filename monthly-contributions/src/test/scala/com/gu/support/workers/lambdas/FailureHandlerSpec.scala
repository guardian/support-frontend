package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.Fixtures.{failureJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.encoding.StateCodecs.completedStateCodec
import com.gu.support.workers.model.monthlyContributions.state.CompletedState
import com.gu.test.tags.annotations.IntegrationTest
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global

@IntegrationTest
class FailureHandlerSpec extends LambdaSpec {

  "EmailService" should "send a failure email" in {
    val service = new EmailService(Configuration.emailServicesConfig.failed)
    val email = "rupert.bates@theguardian.com"
    service.send(EmailFields(email, DateTime.now(), 5, "GBP", "UK", "", "monthly-contribution")).map(result => result.getMessageId should not be "")
  }

  "FailureHandler lambda" should "add message to sqs queue" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(wrapFixture(failureJson), outStream, context)

    Encoding.in[CompletedState](outStream.toInputStream).isSuccess should be(true)
  }

}
