package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.Fixtures.{failureJson, wrap}
import com.gu.support.workers.MockContext
import com.gu.support.workers.encoding.Encoding
import org.joda.time.DateTime
import org.scalatest.{AsyncFlatSpec, Matchers}

class FailureHandlerSpec extends AsyncFlatSpec with Matchers with MockContext {

  "EmailService" should "send a failure email" in {
    val service = new EmailService(Configuration.emailServicesConfig.failed)
    val email = "rupert.bates@theguardian.com"
    service.send(EmailFields(email, DateTime.now(), 5, "GBP", "UK", "")).map(result => result.getMessageId should not be (""))
  }

  "FailureHandler lambda" should "add message to sqs queue" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(wrap(failureJson), outStream, context)

    Encoding.in[Unit](outStream.toInputStream()).isSuccess should be(true)
  }

}
