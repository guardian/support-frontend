package com.gu.support.catalog

import com.gu.support.catalog.FulfilmentOptions.{allFulfilmentOptions, fromString}
import io.circe.{Decoder, Encoder}

sealed abstract class ZuoraProductName(val productName: String)

object ZuoraProductName {

  def fromString(productName: String): Option[ZuoraProductName] =
    allZuoraProductNames.find(_.productName == productName)

  val allZuoraProductNames: List[ZuoraProductName] = List(
    RecurringContribution,
    GuardianWeekly,
    HomeDelivery,
    NationalDelivery,
    DigitalVoucher,
    DigitalSubscription,
    SupporterPlus,
    TierThree,
    GuardianAdLite,
  )

  case object RecurringContribution extends ZuoraProductName("Recurring Contribution")

  case object GuardianWeekly extends ZuoraProductName("Guardian Weekly")

  case object HomeDelivery extends ZuoraProductName("Newspaper - Home Delivery")

  case object NationalDelivery extends ZuoraProductName("Newspaper - National Delivery")

  case object DigitalVoucher extends ZuoraProductName("Newspaper - Digital Voucher")

  case object DigitalSubscription extends ZuoraProductName("Digital Pack")

  case object SupporterPlus extends ZuoraProductName("Supporter Plus")

  case object TierThree extends ZuoraProductName("Tier Three")

  case object GuardianAdLite extends ZuoraProductName("Guardian Ad-Lite")

  implicit val decoder: Decoder[ZuoraProductName] =
    Decoder.decodeString.emap(productName =>
      fromString(productName).toRight(s"unrecognised Zuora product name '$productName'"),
    )

  implicit val encoder: Encoder[ZuoraProductName] = Encoder.encodeString.contramap[ZuoraProductName](_.productName)
}
