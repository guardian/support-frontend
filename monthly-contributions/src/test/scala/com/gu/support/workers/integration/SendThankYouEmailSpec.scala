package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.i18n.Currency
import com.gu.support.workers.Fixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.support.workers.model.DirectDebitPaymentMethod
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import io.circe.Json
import io.circe.parser._
import org.joda.time.DateTime

@IntegrationTest
class SendThankYouEmailSpec extends LambdaSpec {

  "SendThankYouEmail lambda" should "add message to sqs queue" in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequest(wrapFixture(thankYouEmailJson), outStream, context)

    assertUnit(outStream)
  }

  ignore should "send an email" in {
    //This test will send a thank you email to the address below - useful for quickly testing changes
    val addressToSendTo = "rupert.bates@theguardian.com"
    val dd = DirectDebitPaymentMethod("Mickey", "Mouse", "Mickey Mouse", "20202020", "55779911")
    val mandateId = "65HK26E"
    val ef = EmailFields(
      addressToSendTo,
      new DateTime(1999, 12, 31, 11, 59),
      20,
      Currency.GBP.iso,
      "UK", "", "monthly-contribution", Some(dd), Some(mandateId)
    )
    val service = new EmailService(Configuration.emailServicesConfig.thankYou, executionContext)
    service.send(ef)
  }

  "EmailFields" should "include Direct Debit fields in the payload" in {
    val dd = DirectDebitPaymentMethod("Mickey", "Mouse", "Mickey Mouse", "20202020", "55779911")
    val mandateId = "65HK26E"
    val ef = EmailFields("", new DateTime(1999, 12, 31, 11, 59), 20, Currency.GBP.iso, "UK", "", "monthly-contribution", Some(dd), Some(mandateId))
    val resultJson = parse(ef.payload("test"))

    resultJson.isRight should be(true)

    new JsonValidater(resultJson.right.get)
      .validate("Mandate ID", mandateId)
      .validate("account name", dd.bankTransferAccountName)
      .validate("account number", dd.bankTransferAccountNumber)
      .validate("sort code", dd.bankCode)
      .validate("first payment date", "Monday, 10 January 2000")
      .validate("payment method", "Direct Debit")
  }

  it should "still work without a Payment Method" in {
    val ef = EmailFields("", new DateTime(1999, 12, 31, 11, 59), 0, Currency.GBP.iso, "UK", "", "")
    val resultJson = parse(ef.payload("test"))
    resultJson.isRight should be(true)
    (resultJson.right.get \\ "payment method").isEmpty should be(true)
  }

  class JsonValidater(json: Json) {
    def validate(jsonKey: String, expectedValue: String) = {
      (json \\ jsonKey).head.asString.getOrElse("") should equal(expectedValue)
      this
    }
  }

}
