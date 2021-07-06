package com.gu.acquisitionFirehoseTransformer

import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

import com.gu.support.acquisitions
import com.gu.support.acquisitions.models._
import com.amazonaws.services.lambda.runtime.events.KinesisFirehoseEvent

import io.circe.syntax._
import org.joda.time.DateTime
import com.gu.i18n.{Country, Currency}
import com.gu.support.zuora.api.ReaderType
import java.nio.ByteBuffer
import collection.JavaConverters._
import com.gu.acquisitionsValueCalculatorClient.model.AcquisitionModel
import scala.concurrent.ExecutionContext


class LambdaSpec extends AnyFlatSpec with Matchers {

  val mockAVService = new AnnualisedValueServiceWrapper {
    def getAV(acquisitionModel: AcquisitionModel, accountName: String)(implicit executionContext: ExecutionContext): Either[String,Double] = Right(50)
  }

  it should "successfully process a valid batch of acquisitions, filtering out ones without an amount" in {
    val r1 = buildRecord("1", Some(10.0))
    val r2 = buildRecord("2", Some(20.0))
    val r3 = buildRecord("3", None)
    val event = buildEvent(List(r1, r2, r3))

    val result = Lambda.processEvent(event, mockAVService)

    val records = result.getRecords.asScala

    records.length should be(2)

    val jsons = records.toList.map { record => new String(record.getData().array()) }

    jsons(0) should be(
      """{"paymentFrequency":"MONTHLY","countryCode":"GB","amount":10.0,"annualisedValue":50.0,"currency":"GBP","timestamp":"2018-12-13T14:15:04.165Z","campaignCode":"MY_CAMPAIGN_CODE","componentId":"MY_COMPONENT_ID","product":"RECURRING_CONTRIBUTION","paymentProvider":"STRIPE","labels":[]}""" + '\n',
    )
    jsons(1) should be(
      """{"paymentFrequency":"MONTHLY","countryCode":"GB","amount":20.0,"annualisedValue":50.0,"currency":"GBP","timestamp":"2018-12-13T14:15:04.165Z","campaignCode":"MY_CAMPAIGN_CODE","componentId":"MY_COMPONENT_ID","product":"RECURRING_CONTRIBUTION","paymentProvider":"STRIPE","labels":[]}""" + '\n',
    )
  }

  it should "thow an exception when receiving an invalid input" in {
    val r = buildInvalidRecord("1")
    val event = buildEvent(List(r))

    assertThrows[Exception] { Lambda.processEvent(event, mockAVService) }
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
      currency = Currency.GBP,
      componentId = Some("MY_COMPONENT_ID"),
      componentType = None,
      campaignCode = Some("MY_CAMPAIGN_CODE"),
      source = None,
      referrerUrl = None,
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
      platform = None
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
