package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices.{ContributionEmailFields, DigitalPackEmailFields, EmailService}
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.support.workers.Fixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.support.workers.model.{DirectDebitPaymentMethod, Monthly, User}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.Json
import io.circe.parser._
import org.joda.time.DateTime

@IntegrationTest
class SendThankYouEmailSpec extends LambdaSpec {

  "SendThankYouEmail lambda" should "add message to sqs queue" in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequest(wrapFixture(thankYouEmailJson()), outStream, context)

    val result = Encoding.in[SendMessageResult](outStream.toInputStream)
    result.isSuccess should be(true)
  }

  ignore should "send a contribution email" in {
    //This test will send a thank you email to the address below - useful for quickly testing changes
    val addressToSendTo = "rupert.bates@theguardian.com"
    val dd = DirectDebitPaymentMethod("Mickey", "Mouse", "Mickey Mouse", "202020", "55779911")
    val mandateId = "65HK26E"
    val ef = ContributionEmailFields(
      addressToSendTo,
      new DateTime(1999, 12, 31, 11, 59),
      20,
      Currency.GBP,
      "UK", "", "monthly-contribution", Some(dd), Some(mandateId)
    )
    val service = new EmailService(Configuration.contributionEmailServicesConfig.thankYou, executionContext)
    service.send(ef)
  }

  it should "send a digital pack email" in {
    //This test will send a thank you email to the address below - useful for quickly testing changes
    val addressToSendTo = "rupert.bates@theguardian.com"
    val dd = DirectDebitPaymentMethod("Mickey", "Mouse", "Mickey Mouse", "202020", "55779911")
    val mandateId = "65HK26E"
    val user = User("1234", addressToSendTo, "Mickey", "Mouse", UK)
    val ef = DigitalPackEmailFields(
      "A-S00045678",
      Monthly,
      user,
      GBP,
      dd,
      Some(mandateId)
    )
    val service = new EmailService(Configuration.digitalPackEmailServicesConfig.thankYou, executionContext)
    service.send(ef)
  }

  "EmailFields" should "include Direct Debit fields in the payload" in {
    val dd = DirectDebitPaymentMethod("Mickey", "Mouse", "Mickey Mouse", "123456", "55779911")
    val mandateId = "65HK26E"
    val ef = ContributionEmailFields("", new DateTime(1999, 12, 31, 11, 59), 20, Currency.GBP, "UK", "", "monthly-contribution", Some(dd), Some(mandateId))
    val resultJson = parse(ef.payload("test"))

    resultJson.isRight should be(true)

    new JsonValidater(resultJson.right.get)
      .validate("Mandate ID", mandateId)
      .validate("account name", dd.bankTransferAccountName)
      .validate("account number", "******11")
      .validate("sort code", "12-34-56")
      .validate("first payment date", "Monday, 10 January 2000")
      .validate("payment method", "Direct Debit")
      .validate("currency", "£")
  }

  it should "still work without a Payment Method" in {
    val ef = ContributionEmailFields("", new DateTime(1999, 12, 31, 11, 59), 0, Currency.GBP, "UK", "", "")
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
