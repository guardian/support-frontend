package com.gu.support.catalog

import com.gu.i18n.CountryGroup
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX, UAT}
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Corporate, Direct, Gift}
import io.circe.{Decoder, Encoder}

import scala.collection.immutable

sealed trait Product {
  val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Product]]]

  def getProductRatePlan[T <: Product](
      environment: TouchPointEnvironment,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions,
      productOptions: ProductOptions,
      readerType: ReaderType = Direct,
  ): Option[ProductRatePlan[Product]] =
    ratePlans(environment).find(prp =>
      prp.billingPeriod == billingPeriod &&
        prp.fulfilmentOptions == fulfilmentOptions &&
        prp.productOptions == productOptions &&
        prp.readerType == readerType,
    )

  def getProductRatePlans(environment: TouchPointEnvironment) = ratePlans(environment)

  def getProductRatePlanIds(environment: TouchPointEnvironment) = ratePlans(environment).map(_.id)

  def supportedCountries(environment: TouchPointEnvironment): List[CountryGroup] =
    ratePlans(environment)
      .flatMap(productRatePlan => productRatePlan.supportedTerritories)
      .distinct
}

case object SupporterPlus extends Product {
  private def productRatePlan(
      id: String,
      billingPeriod: BillingPeriod,
  ) =
    ProductRatePlan(
      id,
      billingPeriod,
      NoFulfilmentOptions,
      NoProductOptions,
      s"Supporter Plus ${billingPeriod.getClass.getSimpleName}",
    )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[SupporterPlus.type]]] =
    Map(
      PROD -> List(
        productRatePlan("8a12865b8219d9b401822106192b64dc", Monthly),
        productRatePlan("8a12865b8219d9b40182210618a464ba", Annual),
      ),
      UAT -> List(
        productRatePlan("8ad088718219a6b601822036a6c91f5c", Monthly),
        productRatePlan("8ad088718219a6b601822036a5801f34", Annual),
      ),
      SANDBOX -> List(
        productRatePlan("8ad09fc281de1ce70181de3b251736a4", Monthly),
        productRatePlan("8ad09fc281de1ce70181de3b28ee3783", Annual),
      ),
    )
}

case object DigitalPack extends Product {
  private def productRatePlan(
      id: String,
      billingPeriod: BillingPeriod,
      description: String,
      readerType: ReaderType = Direct,
  ) =
    ProductRatePlan(id, billingPeriod, NoFulfilmentOptions, NoProductOptions, description, readerType = readerType)

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[DigitalPack.type]]] =
    Map(
      PROD -> List(
        productRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, "Digital Subscription Monthly"),
        productRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, "Digital Subscription Annual"),
        productRatePlan("2c92a00d71c96bac0171df3a5622740f", Monthly, "Digital Subscription Redemption Code", Corporate),
        productRatePlan("2c92a00d779932ef0177a65430d30ac1", Quarterly, "Digital Subscription Three Month Gift", Gift),
        productRatePlan("2c92a00c77992ba70177a6596f710265", Annual, "Digital Subscription One Year Gift", Gift),
      ),
      UAT -> List(
        productRatePlan("2c92c0f94f2acf73014f2c908f671591", Monthly, "Digital Subscription Monthly"),
        productRatePlan("2c92c0f84f2ac59d014f2c94aea9199e", Annual, "Digital Subscription Annual"),
        productRatePlan("2c92c0f971c65df50171dfabef87093d", Monthly, "Digital Subscription Redemption Code", Corporate),
        productRatePlan("2c92c0f9778c090d017795ef3000352f", Quarterly, "Digital Subscription Three Month Gift", Gift),
        productRatePlan("2c92c0f9778c0900017795da493b4f85", Annual, "Digital Subscription One Year Gift", Gift),
      ),
      SANDBOX -> List(
        productRatePlan("2c92c0f84bbfec8b014bc655f4852d9d", Monthly, "Digital Subscription Monthly"),
        productRatePlan("2c92c0f94bbffaaa014bc6a4212e205b", Annual, "Digital Subscription Annual"),
        productRatePlan("2c92c0f971c65dfe0171c6c1f86e603c", Monthly, "Digital Subscription Redemption Code", Corporate),
        productRatePlan("2c92c0f8778bf8f60177915b477714aa", Quarterly, "Digital Subscription Three Month Gift", Gift),
        productRatePlan("2c92c0f8778bf8cd0177a610cdf230ae", Annual, "Digital Subscription One Year Gift", Gift),
      ),
    )
}

case object Contribution extends Product {
  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Contribution.type]]] =
    Map(
      PROD -> List(
        ProductRatePlan(
          "2c92a0fc5aacfadd015ad24db4ff5e97",
          Monthly,
          NoFulfilmentOptions,
          NoProductOptions,
          "Monthly Contribution",
        ),
        ProductRatePlan(
          "2c92a0fc5e1dc084015e37f58c200eea",
          Annual,
          NoFulfilmentOptions,
          NoProductOptions,
          "Annual Contribution",
        ),
      ),
      UAT -> List(
        ProductRatePlan(
          "2c92c0f85ab269be015acd9d014549b7",
          Monthly,
          NoFulfilmentOptions,
          NoProductOptions,
          "Monthly Contribution",
        ),
        ProductRatePlan(
          "2c92c0f95e1d5c9c015e38f8c87d19a1",
          Annual,
          NoFulfilmentOptions,
          NoProductOptions,
          "Annual Contribution",
        ),
      ),
      SANDBOX -> List(
        ProductRatePlan(
          "2c92c0f85a6b134e015a7fcd9f0c7855",
          Monthly,
          NoFulfilmentOptions,
          NoProductOptions,
          "Monthly Contribution",
        ),
        ProductRatePlan(
          "2c92c0f85e2d19af015e3896e824092c",
          Annual,
          NoFulfilmentOptions,
          NoProductOptions,
          "Annual Contribution",
        ),
      ),
    )
}

case object Paper extends Product {

  private def collection(
      productRatePlanId: ProductRatePlanId,
      productOptions: ProductOptions,
      description: String,
  ): ProductRatePlan[Paper.type] =
    ProductRatePlan(productRatePlanId, Monthly, Collection, productOptions, description, List(CountryGroup.UK))

  private def homeDelivery(
      productRatePlanId: ProductRatePlanId,
      productOptions: ProductOptions,
      description: String,
  ): ProductRatePlan[Paper.type] =
    ProductRatePlan(productRatePlanId, Monthly, HomeDelivery, productOptions, description, List(CountryGroup.UK))

  private val prodCollection: List[ProductRatePlan[Paper.type]] =
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
      collection("2c92a00870ec598001710740c78d2f13", Everyday, "Voucher Everyday"),
    )

  private val uatCollection: List[ProductRatePlan[Paper.type]] = List(
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

  private val sandboxCollection: List[ProductRatePlan[Paper.type]] = List(
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
      )),
    )
}

case object GuardianWeekly extends Product {
  // The value for six for six billing period here must match
  // the value in support-frontend/assets/helpers/productPrice/billingPeriods.js
  val postIntroductorySixForSixBillingPeriod: BillingPeriod = Monthly
  private def domestic(
      id: String,
      billingPeriod: BillingPeriod,
      description: String,
      productRatePlanChargeId: Option[String] = None,
      readerType: ReaderType = Direct,
  ) = ProductRatePlan(
    id,
    billingPeriod,
    Domestic,
    NoProductOptions,
    description,
    productRatePlanChargeId = productRatePlanChargeId,
    readerType = readerType,
  )

  private def restOfWorld(
      id: String,
      billingPeriod: BillingPeriod,
      description: String,
      productRatePlanChargeId: Option[String] = None,
      readerType: ReaderType = Direct,
  ) = ProductRatePlan(
    id,
    billingPeriod,
    RestOfWorld,
    NoProductOptions,
    description,
    productRatePlanChargeId = productRatePlanChargeId,
    readerType = readerType,
  )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[GuardianWeekly.type]]] =
    Map(
      PROD -> List(
        restOfWorld(
          "2c92a0086619bf8901661ab545f51b21",
          SixWeekly,
          "Guardian Weekly 6 for 6, rest of world delivery",
          productRatePlanChargeId = Some("2c92a0086619bf8901661ab546091b23"),
        ),
        restOfWorld("2c92a0fe6619b4b601661ab300222651", Annual, "Guardian Weekly annual, rest of world delivery"),
        restOfWorld(
          "2c92a0ff67cebd140167f0a2f66a12eb",
          Annual,
          "Guardian Weekly one year, rest of world delivery",
          readerType = Gift,
        ),
        restOfWorld("2c92a0086619bf8901661ab02752722f", Quarterly, "Guardian Weekly quarterly, rest of world delivery"),
        restOfWorld("2c92a0ff79ac64e30179ae45669b3a83", Monthly, "Guardian Weekly monthly, rest of world delivery"),
        restOfWorld(
          "2c92a0076dd9892e016df8503e7c6c48",
          Quarterly,
          "Guardian Weekly three month, rest of world delivery",
          readerType = Gift,
        ),
        domestic(
          "2c92a0086619bf8901661aaac94257fe",
          SixWeekly,
          "Guardian Weekly 6 for 6, domestic delivery",
          productRatePlanChargeId = Some("2c92a0086619bf8901661aaac95d5800"),
        ),
        domestic("2c92a0fe6619b4b901661aa8e66c1692", Annual, "Guardian Weekly annual, domestic delivery"),
        domestic(
          "2c92a0ff67cebd0d0167f0a1a834234e",
          Annual,
          "Guardian Weekly one year, domestic delivery",
          readerType = Gift,
        ),
        domestic("2c92a0fe6619b4b301661aa494392ee2", Quarterly, "Guardian Weekly quarterly, domestic delivery"),
        domestic("2c92a0fd79ac64b00179ae3f9d474960", Monthly, "Guardian Weekly monthly, domestic delivery"),
        domestic(
          "2c92a00e6dd988e2016df85387417498",
          Quarterly,
          "Guardian Weekly three months, domestic delivery",
          readerType = Gift,
        ),
      ),
      UAT -> List(
        restOfWorld(
          "2c92c0f9660fc4c70166109dfd08092c",
          SixWeekly,
          "Guardian Weekly 6 for 6, rest of world delivery",
          productRatePlanChargeId = Some("2c92c0f9660fc4c70166109dfd17092e"),
        ),
        restOfWorld("2c92c0f9660fc4d70166109a2eb0607c", Annual, "Guardian Weekly annual, rest of world delivery"),
        restOfWorld(
          "2c92c0f967caee360167f044cd0d4adc",
          Annual,
          "Guardian Weekly one year, rest of world delivery",
          readerType = Gift,
        ),
        restOfWorld("2c92c0f9660fc4d70166109c01465f10", Quarterly, "Guardian Weekly quarterly, rest of world delivery"),
        restOfWorld("2c92c0f979a6b0910179ae4611f1256f", Monthly, "Guardian Weekly monthly, rest of world delivery"),
        restOfWorld(
          "2c92c0f96df75b5a016df84084fb356d",
          Quarterly,
          "Guardian Weekly three months, rest of world delivery",
          readerType = Gift,
        ),
        domestic(
          "2c92c0f8660fb5dd016610858eb90658",
          SixWeekly,
          "Guardian Weekly 6 for 6, domestic delivery",
          productRatePlanChargeId = Some("2c92c0f8660fb5dd016610858ed3065a"),
        ),
        domestic("2c92c0f9660fc4d70166107fa5412641", Annual, "Guardian Weekly annual, domestic delivery"),
        domestic(
          "2c92c0f867cae0700167f043870d6d0e",
          Annual,
          "Guardian Weekly one year, domestic delivery",
          readerType = Gift,
        ),
        domestic("2c92c0f8660fb5d601661081ea010391", Quarterly, "Guardian Weekly quarterly, domestic delivery"),
        domestic("2c92c0f879a6a11e0179ae3fa5bb1313", Monthly, "Guardian Weekly monthly, domestic delivery"),
        domestic(
          "2c92c0f96df75b51016df8444f36362f",
          Quarterly,
          "Guardian Weekly three months, domestic delivery",
          readerType = Gift,
        ),
      ),
      SANDBOX -> List(
        restOfWorld(
          "2c92c0f965f2122101660fbc75a16c38",
          SixWeekly,
          "Guardian Weekly 6 for 6, rest of world delivery",
          productRatePlanChargeId = Some("2c92c0f965f2122101660fbc75ba6c3c"),
        ),
        restOfWorld("2c92c0f965f2122101660fb33ed24a45", Annual, "Guardian Weekly annual, rest of world delivery"),
        restOfWorld(
          "2c92c0f967caee410167eff78e7b5244",
          Annual,
          "Guardian Weekly one year, rest of world delivery",
          readerType = Gift,
        ),
        restOfWorld("2c92c0f965f2122101660fb81b745a06", Quarterly, "Guardian Weekly quarterly, rest of world delivery"),
        restOfWorld("2c92c0f878ac402c0178acb3a90a3620", Monthly, "Guardian Weekly monthly, rest of world delivery"),
        restOfWorld(
          "2c92c0f96df75b5a016df81ba1c62609",
          Quarterly,
          "Guardian Weekly three months, rest of world delivery",
          readerType = Gift,
        ),
        domestic(
          "2c92c0f965f212210165f69b94c92d66",
          SixWeekly,
          "Guardian Weekly 6 for 6, domestic delivery",
          productRatePlanChargeId = Some("2c92c0f865f204440165f69f407d66f1"),
        ),
        domestic("2c92c0f965d280590165f16b1b9946c2", Annual, "Guardian Weekly annual, domestic delivery"),
        domestic(
          "2c92c0f867cae0700167eff921734f7b",
          Annual,
          "Guardian Weekly one year, domestic delivery",
          readerType = Gift,
        ),
        domestic("2c92c0f965dc30640165f150c0956859", Quarterly, "Guardian Weekly quarterly, domestic delivery"),
        domestic("2c92c0f878ac40300178acaa04bb401d", Monthly, "Guardian Weekly monthly, domestic delivery"),
        domestic(
          "2c92c0f96ded216a016df491134d4091",
          Quarterly,
          "Guardian Weekly three months, domestic delivery",
          readerType = Gift,
        ),
      ),
    )
}

object Product {
  lazy val allProducts: List[Product] = List(DigitalPack, Contribution, GuardianWeekly, Paper)

  def fromString(code: String): Option[Product] = allProducts.find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[Product] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised product '$code'"))
  implicit val encode: Encoder[Product] = Encoder.encodeString.contramap[Product](_.toString)
}
