package com.gu.support.catalog

import com.gu.support.workers._

sealed trait Product

case object DigitalPack extends Product {
  lazy val ratePlans: List[ProductRatePlan[DigitalPack.type]] =
    List(
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions),
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions),

    )
}

case object Contribution extends Product {
  lazy val ratePlans: List[ProductRatePlan[Contribution.type]] =
    List(
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions),
      ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions),
    )
}

case object Paper extends Product {
  lazy val ratePlans: List[ProductRatePlan[Paper.type]] =
    List(
      ProductRatePlan("2c92a0fd6205707201621fa1350710e3", Monthly, Collection, SaturdayPlus),
      ProductRatePlan("2c92a0fd6205707201621f9f6d7e0116", Monthly, Collection, Saturday),
      ProductRatePlan("2c92a0fe56fe33ff0157040d4b824168", Monthly, Collection, SundayPlus),
      ProductRatePlan("2c92a0fe5af9a6b9015b0fe1ecc0116c", Monthly, Collection, Sunday),
      ProductRatePlan("2c92a0fd56fe26b60157040cdd323f76", Monthly, Collection, WeekendPlus),
      ProductRatePlan("2c92a0ff56fe33f00157040f9a537f4b", Monthly, Collection, Weekend),
      ProductRatePlan("2c92a0fc56fe26ba0157040c5ea17f6a", Monthly, Collection, SixdayPlus),
      ProductRatePlan("2c92a0fd56fe270b0157040e42e536ef", Monthly, Collection, Sixday),
      ProductRatePlan("2c92a0ff56fe33f50157040bbdcf3ae4", Monthly, Collection, EverydayPlus),
      ProductRatePlan("2c92a0fd56fe270b0157040dd79b35da", Monthly, Collection, Everyday),
      ProductRatePlan("2c92a0ff6205708e01622484bb2c4613", Monthly, HomeDelivery, SaturdayPlus),
      ProductRatePlan("2c92a0fd5e1dcf0d015e3cb39d0a7ddb", Monthly, HomeDelivery, Saturday),
      ProductRatePlan("2c92a0fd560d13880156136b8e490f8b", Monthly, HomeDelivery, SundayPlus),
      ProductRatePlan("2c92a0ff5af9b657015b0fea5b653f81", Monthly, HomeDelivery, Sunday),
      ProductRatePlan("2c92a0ff560d311b0156136b9f5c3968", Monthly, HomeDelivery, WeekendPlus),
      ProductRatePlan("2c92a0fd5614305c01561dc88f3275be", Monthly, HomeDelivery, Weekend),
      ProductRatePlan("2c92a0ff560d311b0156136b697438a9", Monthly, HomeDelivery, SixdayPlus),
      ProductRatePlan("2c92a0ff560d311b0156136f2afe5315", Monthly, HomeDelivery, Sixday),
      ProductRatePlan("2c92a0fd560d132301560e43cf041a3c", Monthly, HomeDelivery, EverydayPlus),
      ProductRatePlan("2c92a0fd560d13880156136b72e50f0c", Monthly, HomeDelivery, Everyday),

    )
}

case object GuardianWeekly extends Product {
  lazy val ratePlans: List[ProductRatePlan[GuardianWeekly.type]] =
    List(
      ProductRatePlan("2c92a0086619bf8901661ab545f51b21", SixWeekly, RestOfWorld, NoProductOptions), //TODO: remove SixWeekly and use promotions instead
      ProductRatePlan("2c92a0fe6619b4b601661ab300222651", Annual, RestOfWorld, NoProductOptions),
      ProductRatePlan("2c92a0086619bf8901661ab02752722f", Quarterly, RestOfWorld, NoProductOptions),
      ProductRatePlan("2c92a0086619bf8901661aaac94257fe", SixWeekly, Domestic, NoProductOptions),
      ProductRatePlan("2c92a0fe6619b4b901661aa8e66c1692", Annual, Domestic, NoProductOptions),
      ProductRatePlan("2c92a0fe6619b4b301661aa494392ee2", Quarterly, Domestic, NoProductOptions),
    )
}
