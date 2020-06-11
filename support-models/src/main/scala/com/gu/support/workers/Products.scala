package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{DigitalProductOptions, FulfilmentOptions, NoProductOptions, PaperProductOptions, ProductOptions}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import com.gu.support.encoding.JsonHelpers._


sealed trait ProductType {
  def currency: Currency
  def billingPeriod: BillingPeriod

  override def toString: String = this.getClass.getSimpleName
  def describe: String
  val catalogType: com.gu.support.catalog.Product
}

case class Contribution(
  amount: BigDecimal,
  currency: Currency,
  billingPeriod: BillingPeriod
) extends ProductType {
  override val catalogType = com.gu.support.catalog.Contribution
  override def describe: String = s"$billingPeriod-Contribution-$currency-$amount"
}

case class DigitalPack(
  currency: Currency,
  billingPeriod: BillingPeriod,
  productOptions: DigitalProductOptions = NoProductOptions
) extends ProductType {
  override val catalogType = com.gu.support.catalog.DigitalPack
  override def describe: String = s"$billingPeriod-DigitalPack-$currency"
}

case class Paper(
  currency: Currency = GBP,
  billingPeriod: BillingPeriod = Monthly,
  fulfilmentOptions: FulfilmentOptions,
  productOptions: PaperProductOptions
) extends ProductType {
  override val catalogType = com.gu.support.catalog.Paper
  override def describe: String = s"Paper-$fulfilmentOptions-$productOptions"
}

case class GuardianWeekly(
  currency: Currency,
  billingPeriod: BillingPeriod,
  fulfilmentOptions: FulfilmentOptions,
) extends ProductType {
  override val catalogType = com.gu.support.catalog.GuardianWeekly
  override def describe: String = s"$billingPeriod-GuardianWeekly-$fulfilmentOptions-$currency"
}

object ProductType {
  import com.gu.support.encoding.CustomCodecs._
  implicit val decoderDigital: Decoder[DigitalPack] = deriveDecoder[DigitalPack]
    .prepare(_.withFocus(_.mapObject(_.checkKeyExists("productOptions", Json.fromString("NoProductOptions")))))
  implicit val encoderDigital: Encoder[DigitalPack] = deriveEncoder
  implicit val codecContribution: Codec[Contribution] = deriveCodec
  implicit val codecPaper: Codec[Paper] = deriveCodec
  implicit val codecGuardianWeekly: Codec[GuardianWeekly] = deriveCodec

  implicit val encodeProduct: Encoder[ProductType] = Encoder.instance {
    case d: DigitalPack => d.asJson.asObject.map(_.add("productType", Json.fromString("DigitalPack"))).asJson
    case c: Contribution => c.asJson.asObject.map( _.add("productType", Json.fromString("Contribution"))).asJson
    case p: Paper => p.asJson.asObject.map(_.add("productType", Json.fromString("Paper"))).asJson
    case g: GuardianWeekly => g.asJson.asObject.map(_.add("productType", Json.fromString("GuardianWeekly"))).asJson
  }

  implicit val decodeProduct: Decoder[ProductType] =
    List[Decoder[ProductType]](
      Decoder[Contribution].widen,
      Decoder[Paper].widen,
      Decoder[GuardianWeekly].widen,
      Decoder[DigitalPack].widen
    ).reduceLeft(_ or _)
}
