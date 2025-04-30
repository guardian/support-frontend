package com.gu.support.catalog

import io.circe.Encoder

sealed abstract class ZuoraProductName (val productName: String)

object ZuoraProductName {
  case object RecurringContribution extends ZuoraProductName("Recurring Contribution")

  case object GuardianWeekly extends ZuoraProductName("Guardian Weekly")

  case object HomeDelivery extends ZuoraProductName("Newspaper - Home Delivery")

  case object NationalDelivery extends ZuoraProductName("Newspaper - National Delivery")

  case object DigitalVoucher extends ZuoraProductName("Newspaper - Digital Voucher")

  case object DigitalSubscription extends ZuoraProductName("Digital Pack")

  case object SupporterPlus extends ZuoraProductName("Supporter Plus")

  case object TierThree extends ZuoraProductName("Tier Three")

  case object GuardianAdLite extends ZuoraProductName("Guardian Ad-Lite")

  implicit val encoder: Encoder[ZuoraProductName] = Encoder.encodeString.contramap[ZuoraProductName](_.productName)
}
