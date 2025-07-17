package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{
  FulfilmentOptions,
  NoFulfilmentOptions,
  NoProductOptions,
  PaperProductOptions,
  ProductOptions,
}
import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.JsonHelpers._
import com.gu.support.paperround.AgentId
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Direct
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import com.gu.support.workers.ProductType.discriminatedType

sealed trait ProductType {
  def currency: Currency
  def billingPeriod: BillingPeriod

  override def toString: String = this.getClass.getSimpleName
  def describe: String
}

case class Contribution(
    amount: BigDecimal,
    currency: Currency,
    billingPeriod: BillingPeriod,
) extends ProductType {
  override def describe: String = s"$billingPeriod-Contribution-$currency-$amount"
}

case class TierThree(
    currency: Currency,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: ProductOptions = NoProductOptions,
) extends ProductType {
  override def describe: String = s"$billingPeriod-TierThree-$currency-$fulfilmentOptions-$productOptions"
}

case class SupporterPlus(
    amount: BigDecimal,
    currency: Currency,
    billingPeriod: BillingPeriod,
) extends ProductType {
  override def describe: String = s"$billingPeriod-SupporterPlus-$currency-$amount"
}

case class DigitalPack(
    currency: Currency,
    billingPeriod: BillingPeriod,
) extends ProductType {
  override def describe: String = s"$billingPeriod-DigitalPack-$currency"
}

case class Paper(
    currency: Currency = GBP,
    billingPeriod: BillingPeriod = Monthly,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: PaperProductOptions,
    deliveryAgent: Option[AgentId],
) extends ProductType {
  override def describe: String = s"Paper-$fulfilmentOptions-$productOptions"
}

case class GuardianWeekly(
    currency: Currency,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions,
) extends ProductType {
  override def describe: String = s"$billingPeriod-GuardianWeekly-$fulfilmentOptions-$currency"
}

case class GuardianAdLite(
    currency: Currency,
) extends ProductType {
  override def describe: String = s"GuardianAdLite-$currency"

  override def billingPeriod: BillingPeriod = Monthly
}

object ProductType {
  import com.gu.support.encoding.CustomCodecs._

  val discriminatedType = new DiscriminatedType[ProductType]("productType")

  implicit val codecContribution: discriminatedType.VariantCodec[Contribution] =
    discriminatedType.variant[Contribution]("Contribution")
  implicit val codecSupporterPlus: discriminatedType.VariantCodec[SupporterPlus] =
    discriminatedType.variant[SupporterPlus]("SupporterPlus")
  implicit val codecTierThree: discriminatedType.VariantCodec[TierThree] =
    discriminatedType.variant[TierThree]("TierThree")
  implicit val codecPaper: discriminatedType.VariantCodec[Paper] = discriminatedType.variant[Paper]("Paper")
  implicit val codecGuardianWeekly: discriminatedType.VariantCodec[GuardianWeekly] =
    discriminatedType.variant[GuardianWeekly]("GuardianWeekly")
  implicit val codecDigital: discriminatedType.VariantCodec[DigitalPack] =
    discriminatedType.variant[DigitalPack]("DigitalPack")
  implicit val codecGuardianAdLite: discriminatedType.VariantCodec[GuardianAdLite] =
    discriminatedType.variant[GuardianAdLite]("GuardianAdLite")

  implicit val codec: Codec[ProductType] =
    discriminatedType.codec(
      List(
        codecContribution,
        codecSupporterPlus,
        codecTierThree,
        codecPaper,
        codecGuardianWeekly,
        codecDigital,
        codecGuardianAdLite,
      ),
    )

}
