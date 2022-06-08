package com.gu.acquisitionFirehoseTransformer

import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

import com.gu.support.acquisitions.models._
import com.amazonaws.services.lambda.runtime.events.KinesisFirehoseEvent

import io.circe.syntax._
import org.joda.time.DateTime
import com.gu.i18n.{Country, Currency}
import com.gu.support.zuora.api.ReaderType
import java.nio.ByteBuffer
import scala.jdk.CollectionConverters._
import scala.concurrent.ExecutionContext

class LambdaSpec extends AnyFlatSpec with Matchers {

  val mockGBPService = new GBPConversionService {
    override def convert(currency: Currency, amount: Double, dateTime: DateTime): Either[String, Double] = Right(
      amount * 1.2,
    )
  }

  it should "successfully process a valid batch of acquisitions, filtering out ones without an amount" in {
    val r1 = buildRecord("1", Some(10.0))
    val r2 = buildRecord("2", Some(20.0))
    val r3 = buildRecord("3", None)
    val event = buildEvent(List(r1, r2, r3))

    val result = Lambda.processEvent(event, mockGBPService)

    val records = result.getRecords.asScala

    records.length should be(2)

    val jsons = records.toList.map { record => new String(record.getData().array()) }

    jsons(0) should be(
      """{"paymentFrequency":"MONTHLY","countryCode":"GB","amount":10.0,"annualisedValue":100.18037999999999,"annualisedValueGBP":120.21645599999998,"currency":"USD","timestamp":"2018-12-13 14:15:04","campaignCode":"MY_CAMPAIGN_CODE","componentId":"MY_COMPONENT_ID","product":"RECURRING_CONTRIBUTION","paymentProvider":"STRIPE","referrerUrl":"referrer-url","labels":[]}""" + '\n',
    )
    jsons(1) should be(
      """{"paymentFrequency":"MONTHLY","countryCode":"GB","amount":20.0,"annualisedValue":200.36075999999997,"annualisedValueGBP":240.43291199999996,"currency":"USD","timestamp":"2018-12-13 14:15:04","campaignCode":"MY_CAMPAIGN_CODE","componentId":"MY_COMPONENT_ID","product":"RECURRING_CONTRIBUTION","paymentProvider":"STRIPE","referrerUrl":"referrer-url","labels":[]}""" + '\n',
    )
  }

  it should "thow an exception when receiving an invalid input" in {
    val r = buildInvalidRecord("1")
    val event = buildEvent(List(r))

    assertThrows[Exception] { Lambda.processEvent(event, mockGBPService) }
  }

  def buildEvent(records: List[KinesisFirehoseEvent.Record]): KinesisFirehoseEvent = {
    val event = new KinesisFirehoseEvent()
    event.setRecords(records.asJava)

    event
  }

  def buildRecord(id: String, amount: Option[BigDecimal]): KinesisFirehoseEvent.Record = {
    val acquisition = AcquisitionDataRow(
      eventTimeStamp = new DateTime(1544710504165L),
      product = AcquisitionProduct.RecurringContribution,
      amount = amount,
      country = Country.UK,
      currency = Currency.USD,
      componentId = Some("MY_COMPONENT_ID"),
      componentType = None,
      campaignCode = Some("MY_CAMPAIGN_CODE"),
      source = None,
      referrerUrl = Some("referrer-url"),
      abTests = Nil,
      paymentFrequency = PaymentFrequency.Monthly,
      paymentProvider = Some(PaymentProvider.Stripe),
      printOptions = None,
      browserId = None,
      identityId = None,
      pageViewId = None,
      referrerPageViewId = None,
      labels = Nil,
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      zuoraAccountNumber = None,
      contributionId = None,
      paymentId = None,
      queryParameters = Nil,
      platform = None,
    )

    val record = new KinesisFirehoseEvent.Record()
    record.setRecordId(id)
    record.setData(ByteBuffer.wrap(acquisition.asJson.noSpaces.getBytes))

    record
  }

  def buildInvalidRecord(id: String): KinesisFirehoseEvent.Record = {
    val record = new KinesisFirehoseEvent.Record()
    record.setRecordId(id)
    record.setData(ByteBuffer.wrap("".getBytes))

    record
  }
}
