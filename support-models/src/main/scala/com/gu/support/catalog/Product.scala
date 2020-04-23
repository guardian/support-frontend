package com.gu.support.catalog

import com.gu.i18n.CountryGroup
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX, UAT}
import com.gu.support.workers._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable

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

  def getProductRatePlans(environment: TouchPointEnvironment) = ratePlans(environment)

  def getProductRatePlanIds(environment: TouchPointEnvironment) = ratePlans(environment).map(_.id)

  def supportedCountries(environment: TouchPointEnvironment): List[CountryGroup] =
    ratePlans(environment)
      .flatMap(productRatePlan => productRatePlan.supportedTerritories)
      .distinct
}

case object DigitalPack extends Product {
  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[DigitalPack.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions, "Digital Subscription Monthly"),
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions, "Digital Subscription Annual"),
      ),
      UAT -> List(
        ProductRatePlan("2c92c0f94f2acf73014f2c908f671591", Monthly, NoFulfilmentOptions, NoProductOptions, "Digital Subscription Monthly"),
        ProductRatePlan("2c92c0f84f2ac59d014f2c94aea9199e", Annual, NoFulfilmentOptions, NoProductOptions, "Digital Subscription Annual"),
      ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f84bbfec8b014bc655f4852d9d", Monthly, NoFulfilmentOptions, NoProductOptions, "Digital Subscription Monthly"),
        ProductRatePlan("2c92c0f94bbffaaa014bc6a4212e205b", Annual, NoFulfilmentOptions, NoProductOptions, "Digital Subscription Annual"),
      ))
}

case object Contribution extends Product {
  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Contribution.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, NoFulfilmentOptions, NoProductOptions, "Monthly Contribution"),
        ProductRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, NoFulfilmentOptions, NoProductOptions, "Annual Contribution"),
      ),
      UAT -> List(
        ProductRatePlan("2c92c0f85ab269be015acd9d014549b7", Monthly, NoFulfilmentOptions, NoProductOptions, "Monthly Contribution"),
        ProductRatePlan("2c92c0f95e1d5c9c015e38f8c87d19a1", Annual, NoFulfilmentOptions, NoProductOptions, "Annual Contribution"),
      ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f85a6b134e015a7fcd9f0c7855", Monthly, NoFulfilmentOptions, NoProductOptions, "Monthly Contribution"),
        ProductRatePlan("2c92c0f85e2d19af015e3896e824092c", Annual, NoFulfilmentOptions, NoProductOptions, "Annual Contribution"),
      )
    )
}

case object Paper extends Product {

  private def collection(productRatePlanId: ProductRatePlanId, productOptions: ProductOptions, description: String): ProductRatePlan[Paper.type] =
    ProductRatePlan(productRatePlanId, Monthly, Collection, productOptions, description, List(CountryGroup.UK))

  private def homeDelivery(productRatePlanId: ProductRatePlanId, productOptions: ProductOptions, description: String): ProductRatePlan[Paper.type] =
    ProductRatePlan(productRatePlanId, Monthly, HomeDelivery, productOptions, description, List(CountryGroup.UK))

  val useDigitalVoucher = false

  private val prodCollection: List[ProductRatePlan[Paper.type]] = if(useDigitalVoucher) {
    List(
      collection("2c92a00870ec598001710740ce702ff0", SaturdayPlus, "Voucher Saturday+"),
      collection("2c92a00870ec598001710740cdd02fbd", Saturday, "Voucher Saturday"),
      collection("2c92a00870ec598001710740cf9e3004", SundayPlus, "Voucher Sunday+"),
      collection("2c92a00870ec598001710740d0d83017", Sunday, "Voucher Sunday"),
      collection("2c92a00870ec598001710740c6672ee7", WeekendPlus, "Voucher Weekend+"),
      collection("2c92a00870ec598001710740d24b3022", Weekend, "Voucher Weekend"),
      collection("2c92a00870ec598001710740c4582ead", SixdayPlus, "Voucher Sixday+"),
      collection("2c92a00870ec598001710740ca532f69", Sixday, "Voucher Sixday"),
      collection("2c92a00870ec598001710740d3d03035", EverydayPlus, "Voucher Everyday+"),
      collection("2c92a00870ec598001710740c78d2f13", Everyday, "Voucher Everyday")
    )
  } else {
    List(
      collection("2c92a0fd6205707201621fa1350710e3", SaturdayPlus, "Voucher Saturday+"),
      collection("2c92a0fd6205707201621f9f6d7e0116", Saturday, "Voucher Saturday"),
      collection("2c92a0fe56fe33ff0157040d4b824168", SundayPlus, "Voucher Sunday+"),
      collection("2c92a0fe5af9a6b9015b0fe1ecc0116c", Sunday, "Voucher Sunday"),
      collection("2c92a0fd56fe26b60157040cdd323f76", WeekendPlus, "Voucher Weekend+"),
      collection("2c92a0ff56fe33f00157040f9a537f4b", Weekend, "Voucher Weekend"),
      collection("2c92a0fc56fe26ba0157040c5ea17f6a", SixdayPlus, "Voucher Sixday+"),
      collection("2c92a0fd56fe270b0157040e42e536ef", Sixday, "Voucher Sixday"),
      collection("2c92a0ff56fe33f50157040bbdcf3ae4", EverydayPlus, "Voucher Everyday+"),
      collection("2c92a0fd56fe270b0157040dd79b35da", Everyday, "Voucher Everyday")
    )
  }

  private val uatCollection: List[ProductRatePlan[Paper.type]] = if(useDigitalVoucher) {
    List(
      collection("2c92c0f870f682820171070489d542da", SaturdayPlus, "Voucher Saturday+"),
      collection("2c92c0f870f682820171070488df42ce", Saturday, "Voucher Saturday"),
      collection("2c92c0f870f68282017107047b214214", SundayPlus, "Voucher Sunday+"),
      collection("2c92c0f870f682820171070487f142c4", Sunday, "Voucher Sunday"),
      collection("2c92c0f870f682820171070478d441f5", WeekendPlus, "Voucher Weekends+"),
      collection("2c92c0f870f682820171070477d841e2", Weekend, "Voucher Weekend"),
      collection("2c92c0f870f682820171070470ad4120", SixdayPlus, "Voucher Sixday+"),
      collection("2c92c0f870f68282017107047d054230", Sixday, "Voucher Sixday"),
      collection("2c92c0f870f682820171070481bf4264", EverydayPlus, "Voucher Everyday+"),
      collection("2c92c0f870f682820171070474ee419d", Everyday, "Voucher Everyday"),
    )
  } else {
    List(
      collection("2c92c0f961f9cf350161fc0454283f3e", SaturdayPlus, "Voucher Saturday+"),
      collection("2c92c0f961f9cf300161fc02a7d805c9", Saturday, "Voucher Saturday"),
      collection("2c92c0f858aa38af0158b9dae19110a3", SundayPlus, "Voucher Sunday+"),
      collection("2c92c0f95aff3b54015b0ee0eb500b2e", Sunday, "Voucher Sunday"),
      collection("2c92c0f855c9f4b20155d9f1dd0651ab", WeekendPlus, "Voucher Weekends+"),
      collection("2c92c0f855c9f4b20155d9f1db9b5199", Weekend, "Voucher Weekend"),
      collection("2c92c0f855c9f4540155da2607db6402", SixdayPlus, "Voucher Sixday+"),
      collection("2c92c0f955ca02910155da254a641fb3", Sixday, "Voucher Sixday"),
      collection("2c92c0f955ca02920155da240cdb4399", EverydayPlus, "Voucher Everyday+"),
      collection("2c92c0f855c9f4b20155d9f1d3d4512a", Everyday, "Voucher Everyday"),
    )
  }

  private val sandboxCollection: List[ProductRatePlan[Paper.type]] = if(useDigitalVoucher) {
    List(
      collection("2c92c0f86fa49142016fa49eb1732a39", SaturdayPlus, "Voucher Saturday paper+"),
      collection("2c92c0f86fa49142016fa49ea442291b", Saturday, "Voucher Saturday paper"),
      collection("2c92c0f86fa49142016fa49ea90e2976", SundayPlus, "Voucher Sunday paper+"),
      collection("2c92c0f86fa49142016fa49eb0a42a01", Sunday, "Voucher Sunday paper"),
      collection("2c92c0f86fa49142016fa49eaecb29dd", WeekendPlus, "Voucher Weekend+"),
      collection("2c92c0f86fa49142016fa49ea0d028b6", Weekend, "Voucher Weekend"),
      collection("2c92c0f86fa49142016fa49ea1af28c8", SixdayPlus, "Voucher Sixday+"),
      collection("2c92c0f86fa49142016fa49e9b9a286f", Sixday, "Voucher Sixday"),
      collection("2c92c0f86fa49142016fa49eaa492988", EverydayPlus, "Voucher Everyday+"),
      collection("2c92c0f86fa49142016fa49ea56a2938", Everyday, "Voucher Everyday"),
    )
  } else {
    List(
      collection("2c92c0f961f9cf300161fc44f2661258", SaturdayPlus, "Voucher Saturday paper+"),
      collection("2c92c0f861f9c26d0161fc434bfe004c", Saturday, "Voucher Saturday paper"),
      collection("2c92c0f955a0b5bf0155b62623846fc8", SundayPlus, "Voucher Sunday paper+"),
      collection("2c92c0f95aff3b56015b1045fb9332d2", Sunday, "Voucher Sunday paper"),
      collection("2c92c0f95aff3b54015b1047efaa2ac3", WeekendPlus, "Voucher Weekend+"),
      collection("2c92c0f8555ce5cf01556e7f01b81b94", Weekend, "Voucher Weekend"),
      collection("2c92c0f855c3b8190155c585a95e6f5a", SixdayPlus, "Voucher Sixday+"),
      collection("2c92c0f8555ce5cf01556e7f01771b8a", Sixday, "Voucher Sixday"),
      collection("2c92c0f95aff3b53015b10469bbf5f5f", EverydayPlus, "Voucher Everyday+"),
      collection("2c92c0f9555cf10501556e84a70440e2", Everyday, "Voucher Everyday"),
    )
  }

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Paper.type]]] =
    Map(
      PROD -> (prodCollection ++ List(
        homeDelivery("2c92a0ff6205708e01622484bb2c4613", SaturdayPlus, "Home Delivery Saturday+"),
        homeDelivery("2c92a0fd5e1dcf0d015e3cb39d0a7ddb", Saturday, "Home Delivery Saturday"),
        homeDelivery("2c92a0fd560d13880156136b8e490f8b", SundayPlus, "Home Delivery Sunday+"),
        homeDelivery("2c92a0ff5af9b657015b0fea5b653f81", Sunday, "Home Delivery Sunday"),
        homeDelivery("2c92a0ff560d311b0156136b9f5c3968", WeekendPlus, "Home Delivery Weekend+"),
        homeDelivery("2c92a0fd5614305c01561dc88f3275be", Weekend, "Home Delivery Weekend"),
        homeDelivery("2c92a0ff560d311b0156136b697438a9", SixdayPlus, "Home Delivery Sixday+"),
        homeDelivery("2c92a0ff560d311b0156136f2afe5315", Sixday, "Home Delivery Sixday"),
        homeDelivery("2c92a0fd560d132301560e43cf041a3c", EverydayPlus, "Home Delivery Everyday+"),
        homeDelivery("2c92a0fd560d13880156136b72e50f0c", Everyday, "Home Delivery Everyday"),
      )),
      UAT -> (uatCollection ++ List(
        homeDelivery("2c92c0f961f9cf300161fbfa943b6f54", SaturdayPlus, "Home Delivery Saturday+"),
        homeDelivery("2c92c0f85b8fa30e015b9108a83253c7", Saturday, "Home Delivery Saturday"),
        homeDelivery("2c92c0f955ca02900155da27f4872d4d", SundayPlus, "Home Delivery Sunday+"),
        homeDelivery("2c92c0f95aff3b54015b0ede33bc04f2", Sunday, "Home Delivery Sunday"),
        homeDelivery("2c92c0f955ca02900155da27f9402dad", WeekendPlus, "Home Delivery Weekend+"),
        homeDelivery("2c92c0f955ca02900155da27f83c2d9b", Weekend, "Home Delivery Weekend"),
        homeDelivery("2c92c0f955ca02900155da27f29e2d13", SixdayPlus, "Home Delivery Sixday+"),
        homeDelivery("2c92c0f955ca02900155da27ff142e01", Sixday, "Home Delivery Sixday"),
        homeDelivery("2c92c0f955ca02900155da2803b02e33", EverydayPlus, "Home Delivery Everyday+"),
        homeDelivery("2c92c0f955ca02900155da27f55b2d5f", Everyday, "Home Delivery Everyday"),
      )),
      SANDBOX -> (sandboxCollection ++ List(
        homeDelivery("2c92c0f961f9cf300161fc4f71473a34", SaturdayPlus, "Home Delivery Saturday+"),
        homeDelivery("2c92c0f961f9cf300161fc4d2e3e3664", Saturday, "Home Delivery Saturday"),
        homeDelivery("2c92c0f955c3cf0f0155c5d9e83a3cb7", SundayPlus, "Home Delivery Sunday+"),
        homeDelivery("2c92c0f85aff3453015b1041dfd2317f", Sunday, "Home Delivery Sunday"),
        homeDelivery("2c92c0f95aff3b56015b104aa9a13ea5", WeekendPlus, "Home Delivery Weekend+"),
        homeDelivery("2c92c0f955c3cf0f0155c5d9df433bf7", Weekend, "Home Delivery Weekend"),
        homeDelivery("2c92c0f85aff33ff015b1042d4ba0a05", SixdayPlus, "Home Delivery Sixday+"),
        homeDelivery("2c92c0f955c3cf0f0155c5d9ddf13bc5", Sixday, "Home Delivery Sixday"),
        homeDelivery("2c92c0f85aff3453015b10496b5e3d17", EverydayPlus, "Home Delivery Everyday+"),
        homeDelivery("2c92c0f955c3cf0f0155c5d9e2493c43", Everyday, "Home Delivery Everyday"),
      ))
    )
}

case object GuardianWeekly extends Product {

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[GuardianWeekly.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan("2c92a0086619bf8901661ab545f51b21", SixWeekly, RestOfWorld, NoProductOptions, "Guardian Weekly 6 for 6, rest of world delivery",
          productRatePlanChargeId = Some("2c92a0086619bf8901661ab546091b23")),
        ProductRatePlan("2c92a0fe6619b4b601661ab300222651", Annual, RestOfWorld, NoProductOptions, "Guardian Weekly annual, rest of world delivery"),
        ProductRatePlan("2c92a0ff67cebd140167f0a2f66a12eb", Annual, RestOfWorld, NoProductOptions, "Guardian Weekly one year, rest of world delivery",
          fixedTerm = true),
        ProductRatePlan("2c92a0086619bf8901661ab02752722f", Quarterly, RestOfWorld, NoProductOptions, "Guardian Weekly quarterly, rest of world delivery"),
        ProductRatePlan("2c92a0076dd9892e016df8503e7c6c48", Quarterly, RestOfWorld, NoProductOptions, "Guardian Weekly three month, rest of world delivery",
          fixedTerm = true),
        ProductRatePlan("2c92a0086619bf8901661aaac94257fe", SixWeekly, Domestic, NoProductOptions, "Guardian Weekly 6 for 6, domestic delivery",
          productRatePlanChargeId = Some("2c92a0086619bf8901661aaac95d5800")
        ),
        ProductRatePlan("2c92a0fe6619b4b901661aa8e66c1692", Annual, Domestic, NoProductOptions, "Guardian Weekly annual, domestic delivery"),
        ProductRatePlan("2c92a0ff67cebd0d0167f0a1a834234e", Annual, Domestic, NoProductOptions, "Guardian Weekly one year, domestic delivery",
          fixedTerm = true),
        ProductRatePlan("2c92a0fe6619b4b301661aa494392ee2", Quarterly, Domestic, NoProductOptions, "Guardian Weekly quarterly, domestic delivery"),
        ProductRatePlan("2c92a00e6dd988e2016df85387417498", Quarterly, Domestic, NoProductOptions, "Guardian Weekly three months, domestic delivery",
          fixedTerm = true)
      ),
      UAT -> List(
        ProductRatePlan("2c92c0f9660fc4c70166109dfd08092c", SixWeekly, RestOfWorld, NoProductOptions, "Guardian Weekly 6 for 6, rest of world delivery",
          productRatePlanChargeId = Some("2c92c0f9660fc4c70166109dfd17092e")),
        ProductRatePlan("2c92c0f9660fc4d70166109a2eb0607c", Annual, RestOfWorld, NoProductOptions, "Guardian Weekly annual, rest of world delivery"),
        ProductRatePlan("2c92c0f967caee360167f044cd0d4adc", Annual, RestOfWorld, NoProductOptions, "Guardian Weekly one year, rest of world delivery",
          fixedTerm = true),
        ProductRatePlan("2c92c0f9660fc4d70166109c01465f10", Quarterly, RestOfWorld, NoProductOptions, "Guardian Weekly quarterly, rest of world delivery"),
        ProductRatePlan("2c92c0f96df75b5a016df84084fb356d", Quarterly, RestOfWorld, NoProductOptions, "Guardian Weekly three months, rest of world delivery",
          fixedTerm = true),
        ProductRatePlan("2c92c0f8660fb5dd016610858eb90658", SixWeekly, Domestic, NoProductOptions, "Guardian Weekly 6 for 6, domestic delivery",
          productRatePlanChargeId = Some("2c92c0f8660fb5dd016610858ed3065a")),
        ProductRatePlan("2c92c0f9660fc4d70166107fa5412641", Annual, Domestic, NoProductOptions, "Guardian Weekly annual, domestic delivery"),
        ProductRatePlan("2c92c0f867cae0700167f043870d6d0e", Annual, Domestic, NoProductOptions, "Guardian Weekly one year, domestic delivery",
          fixedTerm = true),
        ProductRatePlan("2c92c0f8660fb5d601661081ea010391", Quarterly, Domestic, NoProductOptions, "Guardian Weekly quarterly, domestic delivery"),
        ProductRatePlan("2c92c0f96df75b51016df8444f36362f", Quarterly, Domestic, NoProductOptions, "Guardian Weekly three months, domestic delivery",
          fixedTerm = true)
      ),
      SANDBOX -> List(
        ProductRatePlan("2c92c0f965f2122101660fbc75a16c38", SixWeekly, RestOfWorld, NoProductOptions, "Guardian Weekly 6 for 6, rest of world delivery",
          productRatePlanChargeId = Some("2c92c0f965f2122101660fbc75ba6c3c")),
        ProductRatePlan("2c92c0f965f2122101660fb33ed24a45", Annual, RestOfWorld, NoProductOptions, "Guardian Weekly annual, rest of world delivery"),
        ProductRatePlan("2c92c0f967caee410167eff78e7b5244", Annual, RestOfWorld, NoProductOptions, "Guardian Weekly one year, rest of world delivery",
          fixedTerm = true),
        ProductRatePlan("2c92c0f965f2122101660fb81b745a06", Quarterly, RestOfWorld, NoProductOptions, "Guardian Weekly quarterly, rest of world delivery"),
        ProductRatePlan("2c92c0f96df75b5a016df81ba1c62609", Quarterly, RestOfWorld, NoProductOptions, "Guardian Weekly three months, rest of world delivery",
          fixedTerm = true),
        ProductRatePlan("2c92c0f965f212210165f69b94c92d66", SixWeekly, Domestic, NoProductOptions, "Guardian Weekly 6 for 6, domestic delivery",
          productRatePlanChargeId = Some("2c92c0f865f204440165f69f407d66f1")),
        ProductRatePlan("2c92c0f965d280590165f16b1b9946c2", Annual, Domestic, NoProductOptions, "Guardian Weekly annual, domestic delivery"),
        ProductRatePlan("2c92c0f867cae0700167eff921734f7b", Annual, Domestic, NoProductOptions, "Guardian Weekly one year, domestic delivery",
          fixedTerm = true),
        ProductRatePlan("2c92c0f965dc30640165f150c0956859", Quarterly, Domestic, NoProductOptions, "Guardian Weekly quarterly, domestic delivery"),
        ProductRatePlan("2c92c0f96ded216a016df491134d4091", Quarterly, Domestic, NoProductOptions, "Guardian Weekly three months, domestic delivery",
          fixedTerm = true),
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
