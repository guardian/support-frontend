package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{FulfilmentOptions, PaperProductOptions}
import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.JsonHelpers._
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Direct
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}

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

case class DigitalPack(
    currency: Currency,
    billingPeriod: BillingPeriod,
    readerType: ReaderType = Direct,
    amount: Option[BigDecimal] = None,
) extends ProductType {
  override def describe: String = s"$billingPeriod-DigitalPack-$currency-$readerType"
}

case class Paper(
    currency: Currency = GBP,
    billingPeriod: BillingPeriod = Monthly,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: PaperProductOptions,
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

object ProductType {
  import com.gu.support.encoding.CustomCodecs._

  val discriminatedType = new DiscriminatedType[ProductType]("productType")

  implicit val codecContribution = discriminatedType.variant[Contribution]("Contribution")
  implicit val codecPaper = discriminatedType.variant[Paper]("Paper")
  implicit val codecGuardianWeekly = discriminatedType.variant[GuardianWeekly]("GuardianWeekly")
  implicit val codecDigital = discriminatedType.variant[DigitalPack]("DigitalPack")

  implicit val codec = discriminatedType.codec(List(codecContribution, codecPaper, codecGuardianWeekly, codecDigital))

}
