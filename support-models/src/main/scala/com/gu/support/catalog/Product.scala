package com.gu.support.catalog

import com.gu.i18n.CountryGroup
import com.gu.i18n.CountryGroup._
import com.gu.support.workers.TouchPointEnvironments.{PROD, SANDBOX, UAT}
import com.gu.support.workers._
import io.circe.{Decoder, Encoder}

sealed trait Product {
  val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Product]]]

  def getProductRatePlan[T <: Product](
    environment: TouchPointEnvironment,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: ProductOptions
  ): Option[ProductRatePlan[Product]] =
    ratePlans(environment).find(prp =>
      prp.billingPeriod == billingPeriod &&
        prp.fulfilmentOptions == fulfilmentOptions &&
        prp.productOptions == productOptions
    )

  def supportedCountries(environment: TouchPointEnvironment): List[CountryGroup] =
    ratePlans(environment)
      .flatMap(productRatePlan => productRatePlan.supportedTerritories)
      .distinct
}

case object DigitalPack extends Product {
  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[DigitalPack.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions),
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions),
      ),
      UAT -> List(
        ProductRatePlan("2c92c0f94f2acf73014f2c908f671591", Monthly, NoFulfilmentOptions, NoProductOptions),
        ProductRatePlan("2c92c0f84f2ac59d014f2c94aea9199e", Annual, NoFulfilmentOptions, NoProductOptions),
      ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f84bbfec8b014bc655f4852d9d", Monthly, NoFulfilmentOptions, NoProductOptions),
        ProductRatePlan("2c92c0f94bbffaaa014bc6a4212e205b", Annual, NoFulfilmentOptions, NoProductOptions),
      ))
}

case object Contribution extends Product {
  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Contribution.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions),
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions),
      ),
      UAT -> List(
        ProductRatePlan("2c92c0f85ab269be015acd9d014549b7", Monthly, NoFulfilmentOptions, NoProductOptions),
        ProductRatePlan("2c92c0f95e1d5c9c015e38f8c87d19a1", Annual, NoFulfilmentOptions, NoProductOptions),
      ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f85a6b134e015a7fcd9f0c7855", Monthly, NoFulfilmentOptions, NoProductOptions),
        ProductRatePlan("2c92c0f85e2d19af015e3896e824092c", Annual, NoFulfilmentOptions, NoProductOptions),
      )
    )
}

case object Paper extends Product {
  private lazy val ukOnly = List(CountryGroup.UK)

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Paper.type]]] =
    Map(
      PROD -> List(
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
      ),
      UAT -> List(
        ProductRatePlan("2c92c0f961f9cf350161fc0454283f3e", Monthly, Collection, SaturdayPlus, ukOnly),
        ProductRatePlan("2c92c0f961f9cf300161fc02a7d805c9", Monthly, Collection, Saturday, ukOnly),
        ProductRatePlan("2c92c0f858aa38af0158b9dae19110a3", Monthly, Collection, SundayPlus, ukOnly),
        ProductRatePlan("2c92c0f95aff3b54015b0ee0eb500b2e", Monthly, Collection, Sunday, ukOnly),
        ProductRatePlan("2c92c0f855c9f4b20155d9f1dd0651ab", Monthly, Collection, WeekendPlus, ukOnly),
        ProductRatePlan("2c92c0f855c9f4b20155d9f1db9b5199", Monthly, Collection, Weekend, ukOnly),
        ProductRatePlan("2c92c0f855c9f4540155da2607db6402", Monthly, Collection, SixdayPlus, ukOnly),
        ProductRatePlan("2c92c0f955ca02910155da254a641fb3", Monthly, Collection, Sixday, ukOnly),
        ProductRatePlan("2c92c0f955ca02920155da240cdb4399", Monthly, Collection, EverydayPlus, ukOnly),
        ProductRatePlan("2c92c0f855c9f4b20155d9f1d3d4512a", Monthly, Collection, Everyday, ukOnly),
        ProductRatePlan("2c92c0f961f9cf300161fbfa943b6f54", Monthly, HomeDelivery, SaturdayPlus, ukOnly),
        ProductRatePlan("2c92c0f85b8fa30e015b9108a83253c7", Monthly, HomeDelivery, Saturday, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da27f4872d4d", Monthly, HomeDelivery, SundayPlus, ukOnly),
        ProductRatePlan("2c92c0f95aff3b54015b0ede33bc04f2", Monthly, HomeDelivery, Sunday, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da27f9402dad", Monthly, HomeDelivery, WeekendPlus, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da27f83c2d9b", Monthly, HomeDelivery, Weekend, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da27f29e2d13", Monthly, HomeDelivery, SixdayPlus, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da27ff142e01", Monthly, HomeDelivery, Sixday, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da2803b02e33", Monthly, HomeDelivery, EverydayPlus, ukOnly),
        ProductRatePlan("2c92c0f955ca02900155da27f55b2d5f", Monthly, HomeDelivery, Everyday, ukOnly),
      ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f961f9cf300161fc44f2661258", Monthly, Collection, SaturdayPlus, ukOnly),
        ProductRatePlan("2c92c0f861f9c26d0161fc434bfe004c", Monthly, Collection, Saturday, ukOnly),
        ProductRatePlan("2c92c0f955a0b5bf0155b62623846fc8", Monthly, Collection, SundayPlus, ukOnly),
        ProductRatePlan("2c92c0f95aff3b56015b1045fb9332d2", Monthly, Collection, Sunday, ukOnly),
        ProductRatePlan("2c92c0f95aff3b54015b1047efaa2ac3", Monthly, Collection, WeekendPlus, ukOnly),
        ProductRatePlan("2c92c0f8555ce5cf01556e7f01b81b94", Monthly, Collection, Weekend, ukOnly),
        ProductRatePlan("2c92c0f855c3b8190155c585a95e6f5a", Monthly, Collection, SixdayPlus, ukOnly),
        ProductRatePlan("2c92c0f8555ce5cf01556e7f01771b8a", Monthly, Collection, Sixday, ukOnly),
        ProductRatePlan("2c92c0f95aff3b53015b10469bbf5f5f", Monthly, Collection, EverydayPlus, ukOnly),
        ProductRatePlan("2c92c0f9555cf10501556e84a70440e2", Monthly, Collection, Everyday, ukOnly),
        ProductRatePlan("2c92c0f961f9cf300161fc4f71473a34", Monthly, HomeDelivery, SaturdayPlus, ukOnly),
        ProductRatePlan("2c92c0f961f9cf300161fc4d2e3e3664", Monthly, HomeDelivery, Saturday, ukOnly),
        ProductRatePlan("2c92c0f955c3cf0f0155c5d9e83a3cb7", Monthly, HomeDelivery, SundayPlus, ukOnly),
        ProductRatePlan("2c92c0f85aff3453015b1041dfd2317f", Monthly, HomeDelivery, Sunday, ukOnly),
        ProductRatePlan("2c92c0f95aff3b56015b104aa9a13ea5", Monthly, HomeDelivery, WeekendPlus, ukOnly),
        ProductRatePlan("2c92c0f955c3cf0f0155c5d9df433bf7", Monthly, HomeDelivery, Weekend, ukOnly),
        ProductRatePlan("2c92c0f85aff33ff015b1042d4ba0a05", Monthly, HomeDelivery, SixdayPlus, ukOnly),
        ProductRatePlan("2c92c0f955c3cf0f0155c5d9ddf13bc5", Monthly, HomeDelivery, Sixday, ukOnly),
        ProductRatePlan("2c92c0f85aff3453015b10496b5e3d17", Monthly, HomeDelivery, EverydayPlus, ukOnly),
        ProductRatePlan("2c92c0f955c3cf0f0155c5d9e2493c43", Monthly, HomeDelivery, Everyday, ukOnly),
      )
    )
}

case object GuardianWeekly extends Product {
  private lazy val row = List(RestOfTheWorld)
  private lazy val domestic = List(
    UK,
    US,
    Canada,
    Australia,
    NewZealand,
    Europe
  )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[GuardianWeekly.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan("2c92a0086619bf8901661ab545f51b21", SixWeekly, RestOfWorld, NoProductOptions, row), //TODO: remove SixWeekly and use promotions instead
        ProductRatePlan("2c92a0fe6619b4b601661ab300222651", Annual, RestOfWorld, NoProductOptions, row),
        ProductRatePlan("2c92a0086619bf8901661ab02752722f", Quarterly, RestOfWorld, NoProductOptions, row),
        ProductRatePlan("2c92a0086619bf8901661aaac94257fe", SixWeekly, Domestic, NoProductOptions, domestic),
        ProductRatePlan("2c92a0fe6619b4b901661aa8e66c1692", Annual, Domestic, NoProductOptions, domestic),
        ProductRatePlan("2c92a0fe6619b4b301661aa494392ee2", Quarterly, Domestic, NoProductOptions, domestic),
      ),
      UAT -> List(
          ProductRatePlan("2c92c0f9660fc4c70166109dfd08092c", SixWeekly, RestOfWorld, NoProductOptions, row),
          ProductRatePlan("2c92c0f9660fc4d70166109a2eb0607c", Annual, RestOfWorld, NoProductOptions, row),
          ProductRatePlan("2c92c0f9660fc4d70166109c01465f10", Quarterly, RestOfWorld, NoProductOptions, row),
          ProductRatePlan("2c92c0f8660fb5dd016610858eb90658", SixWeekly, Domestic, NoProductOptions, domestic),
          ProductRatePlan("2c92c0f9660fc4d70166107fa5412641", Annual, Domestic, NoProductOptions, domestic),
          ProductRatePlan("2c92c0f8660fb5d601661081ea010391", Quarterly, Domestic, NoProductOptions, domestic),
        ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f965f2122101660fbc75a16c38", SixWeekly, RestOfWorld, NoProductOptions, row),
        ProductRatePlan("2c92c0f965f2122101660fb33ed24a45", Annual, RestOfWorld, NoProductOptions, row),
        ProductRatePlan("2c92c0f965f2122101660fb81b745a06", Quarterly, RestOfWorld, NoProductOptions, row),
        ProductRatePlan("2c92c0f965f212210165f69b94c92d66", SixWeekly, Domestic, NoProductOptions, domestic),
        ProductRatePlan("2c92c0f965d280590165f16b1b9946c2", Annual, Domestic, NoProductOptions, domestic),
        ProductRatePlan("2c92c0f965dc30640165f150c0956859", Quarterly, Domestic, NoProductOptions, domestic),
      )
    )
}

object Product {
  lazy val allProducts: List[Product] = List(DigitalPack, Contribution, GuardianWeekly, Paper)

  def fromString(code: String): Option[Product] = allProducts.find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[Product] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised product '$code'"))
  implicit val encode: Encoder[Product] = Encoder.encodeString.contramap[Product](_.toString)
}
