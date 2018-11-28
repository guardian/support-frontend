package com.gu.support.workers.model

import com.gu.i18n.Currency
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import cats.syntax.functor._


sealed trait ProductType {
  def currency: Currency
  def billingPeriod: BillingPeriod

  override def toString: String = this.getClass.getSimpleName
  def describe: String
}

case class Contribution(
  amount: BigDecimal,
  currency: Currency,
  billingPeriod: BillingPeriod
) extends ProductType {
  override def describe: String = s"$billingPeriod-Contribution-$currency-$amount"
}

case class DigitalPack(
  currency: Currency,
  billingPeriod: BillingPeriod
) extends ProductType {
  override def describe: String = s"$billingPeriod-DigitalPack-$currency"
}

object ProductType {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codecDigitalPack: Codec[DigitalPack] = deriveCodec
  implicit val codecContribution: Codec[Contribution] = deriveCodec

  implicit val encodeProduct: Encoder[ProductType] = Encoder.instance {
    case d: DigitalPack => d.asJson
    case c: Contribution => c.asJson
  }

  implicit val decodeProduct: Decoder[ProductType] =
    List[Decoder[ProductType]](
      Decoder[Contribution].widen,
      Decoder[DigitalPack].widen
    ).reduceLeft(_ or _)
}
