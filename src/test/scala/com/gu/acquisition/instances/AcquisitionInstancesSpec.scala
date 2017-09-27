package com.gu.acquisition.instances

import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event._
import org.scalatest.WordSpecLike

class AcquisitionInstancesSpec extends WordSpecLike {

  val acquisition = Acquisition(
    product = Product.Contribution,
    paymentFrequency = PaymentFrequency.OneOff,
    currency = "GBP",
    amount = 10.0,
    amountInGBP = None,
    paymentProvider = Some(PaymentProvider.Stripe),
    campaignCode = Some(Set("campaign_code")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name")))),
    countryCode = Some("UK"),
    componentId = Some("epic"),
    componentTypeV2 = Some(ComponentType.AcquisitionsEpic),
    source = Some(AcquisitionSource.GuardianWeb)
  )

  "An acquisition event" should {

    "be able to be encoded to JSON" in {

    }

    "be able to be decoded from JSON" in {

    }
  }
}
