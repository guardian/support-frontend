package com.gu.acquisitionFirehoseTransformer

import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

import com.gu.support.acquisitions
import com.gu.i18n.{ Country, Currency }
import com.gu.support.zuora.api.ReaderType
import com.gu.support.acquisitions.AcquisitionDataRow

import org.joda.time.DateTime

class AcquisitionToJsonSpec extends AnyFlatSpec with Matchers {
  it should "serialise an event to json" in {
    val event = AcquisitionDataRow(
      eventTimeStamp = new DateTime(1544710504165L),
      product = acquisitions.AcquisitionProduct.RecurringContribution,
      amount = Some(20d),
      country = Country.UK,
      currency = Currency.GBP,
      componentId = Some("MY_COMPONENT_ID"),
      componentType = None,
      campaignCode = Some("MY_CAMPAIGN_CODE"),
      source = None,
      referrerUrl = None,
      abTests = Nil,
      paymentFrequency = acquisitions.PaymentFrequency.Monthly,
      paymentProvider = Some(acquisitions.PaymentProvider.Stripe),
      printOptions = None,
      browserId = None,
      identityId = None,
      pageViewId = None,
      referrerPageViewId = None,
      labels = Nil,
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = acquisitions.AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      zuoraAccountNumber = None,
      contributionId = None,
      paymentId = None,
      queryParameters = Nil,
      platform = None
    )

    val jsonString = AcquisitionToJson(event).get.noSpaces
    jsonString should be("""{"paymentFrequency":"MONTHLY","countryCode":"GB","amount":20.0,"currency":"GBP","timestamp":"2018-12-13T14:15:04.165Z","campaignCode":"MY_CAMPAIGN_CODE","componentId":"MY_COMPONENT_ID","product":"RECURRING_CONTRIBUTION","paymentProvider":"STRIPE"}""")
  }
}
