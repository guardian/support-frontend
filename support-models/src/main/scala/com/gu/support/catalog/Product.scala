package com.gu.support.catalog

import com.gu.i18n.CountryGroup
import com.gu.i18n.CountryGroup._
import com.gu.support.workers._
import io.circe.{Decoder, Encoder}

sealed trait Product {
  def ratePlans: List[ProductRatePlan[Product]]

  def getProductRatePlan[T <: Product](
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: ProductOptions
  ): Option[ProductRatePlan[Product]] =
    ratePlans.find(prp =>
      prp.billingPeriod == billingPeriod &&
        prp.fulfilmentOptions == fulfilmentOptions &&
        prp.productOptions == productOptions
    )

  def supportedCountries = ratePlans.flatMap(productRatePlan => productRatePlan.supportedTerritories).distinct
}

case object DigitalPack extends Product {
  def ratePlans: List[ProductRatePlan[DigitalPack.type]] =
    List(
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions),
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions),

    )

  implicit val encoder: Encoder[DigitalPack.type] = Encoder.encodeString.contramap(_ => "DigitalPack")
}

case object Contribution extends Product {
  def ratePlans: List[ProductRatePlan[Contribution.type]] =
    List(
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions),
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions),
    )
}

case object Paper extends Product {
  private val ukOnly = List(CountryGroup.UK)

  def ratePlans: List[ProductRatePlan[Paper.type]] =
    List(
      ProductRatePlan("2c92a0fd6205707201621fa1350710e3", Monthly, Collection, SaturdayPlus, ukOnly),
      ProductRatePlan("2c92a0fd6205707201621f9f6d7e0116", Monthly, Collection, Saturday, ukOnly),
      ProductRatePlan("2c92a0fe56fe33ff0157040d4b824168", Monthly, Collection, SundayPlus, ukOnly),
      ProductRatePlan("2c92a0fe5af9a6b9015b0fe1ecc0116c", Monthly, Collection, Sunday, ukOnly),
      ProductRatePlan("2c92a0fd56fe26b60157040cdd323f76", Monthly, Collection, WeekendPlus, ukOnly),
      ProductRatePlan("2c92a0ff56fe33f00157040f9a537f4b", Monthly, Collection, Weekend, ukOnly),
      ProductRatePlan("2c92a0fc56fe26ba0157040c5ea17f6a", Monthly, Collection, SixdayPlus, ukOnly),
      ProductRatePlan("2c92a0fd56fe270b0157040e42e536ef", Monthly, Collection, Sixday, ukOnly),
      ProductRatePlan("2c92a0ff56fe33f50157040bbdcf3ae4", Monthly, Collection, EverydayPlus, ukOnly),
      ProductRatePlan("2c92a0fd56fe270b0157040dd79b35da", Monthly, Collection, Everyday, ukOnly),
      ProductRatePlan("2c92a0ff6205708e01622484bb2c4613", Monthly, HomeDelivery, SaturdayPlus, ukOnly),
      ProductRatePlan("2c92a0fd5e1dcf0d015e3cb39d0a7ddb", Monthly, HomeDelivery, Saturday, ukOnly),
      ProductRatePlan("2c92a0fd560d13880156136b8e490f8b", Monthly, HomeDelivery, SundayPlus, ukOnly),
      ProductRatePlan("2c92a0ff5af9b657015b0fea5b653f81", Monthly, HomeDelivery, Sunday, ukOnly),
      ProductRatePlan("2c92a0ff560d311b0156136b9f5c3968", Monthly, HomeDelivery, WeekendPlus, ukOnly),
      ProductRatePlan("2c92a0fd5614305c01561dc88f3275be", Monthly, HomeDelivery, Weekend, ukOnly),
      ProductRatePlan("2c92a0ff560d311b0156136b697438a9", Monthly, HomeDelivery, SixdayPlus, ukOnly),
      ProductRatePlan("2c92a0ff560d311b0156136f2afe5315", Monthly, HomeDelivery, Sixday, ukOnly),
      ProductRatePlan("2c92a0fd560d132301560e43cf041a3c", Monthly, HomeDelivery, EverydayPlus, ukOnly),
      ProductRatePlan("2c92a0fd560d13880156136b72e50f0c", Monthly, HomeDelivery, Everyday, ukOnly),
    )
}

case object GuardianWeekly extends Product {
  private val row = List(RestOfTheWorld)
  private val domestic = List(
    UK,
    US,
    Canada,
    Australia,
    NewZealand,
    Europe
  )

  def ratePlans: List[ProductRatePlan[GuardianWeekly.type]] =
    List(
      ProductRatePlan("2c92a0086619bf8901661ab545f51b21", SixWeekly, RestOfWorld, NoProductOptions, row), //TODO: remove SixWeekly and use promotions instead
      ProductRatePlan("2c92a0fe6619b4b601661ab300222651", Annual, RestOfWorld, NoProductOptions, row),
      ProductRatePlan("2c92a0086619bf8901661ab02752722f", Quarterly, RestOfWorld, NoProductOptions, row),
      ProductRatePlan("2c92a0086619bf8901661aaac94257fe", SixWeekly, Domestic, NoProductOptions, domestic),
      ProductRatePlan("2c92a0fe6619b4b901661aa8e66c1692", Annual, Domestic, NoProductOptions, domestic),
      ProductRatePlan("2c92a0fe6619b4b301661aa494392ee2", Quarterly, Domestic, NoProductOptions, domestic),
    )
}

object Product {
  def fromString(code: String) = List(DigitalPack, Contribution, GuardianWeekly, Paper)
    .find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[Product] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised product '$code'"))
  implicit val encode: Encoder[Product] = Encoder.encodeString.contramap[Product](_.toString)
}
