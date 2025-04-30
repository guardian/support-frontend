package com.gu.support.catalog

import com.gu.support.catalog.FulfilmentOptions.{allFulfilmentOptions, fromString}
import io.circe.{Decoder, Encoder}

sealed abstract class ProductName(val productName: String)

object ProductName {

  def fromString(productName: String): Option[ProductName] =
    allProductNames.find(_.productName == productName)

  val allProductNames: List[ProductName] = List(
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

  case object RecurringContribution extends ProductName("Recurring Contribution")

  case object GuardianWeekly extends ProductName("Guardian Weekly")

  case object HomeDelivery extends ProductName("Newspaper - Home Delivery")

  case object NationalDelivery extends ProductName("Newspaper - National Delivery")

  case object DigitalVoucher extends ProductName("Newspaper - Digital Voucher")

  case object DigitalSubscription extends ProductName("Digital Pack")

  case object Contribution extends ProductName("Contribution")

  case object SupporterPlus extends ProductName("Supporter Plus")

  case object TierThree extends ProductName("Tier Three")

  case object GuardianAdLite extends ProductName("Guardian Ad-Lite")

  implicit val decoder: Decoder[ProductName] =
    Decoder.decodeString.emap(productName =>
      fromString(productName).toRight(s"unrecognised product name '$productName'"),
    )

  implicit val encoder: Encoder[ProductName] = Encoder.encodeString.contramap[ProductName](_.productName)
}
