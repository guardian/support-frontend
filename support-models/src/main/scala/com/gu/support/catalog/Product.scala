package com.gu.support.catalog

import com.gu.i18n.CountryGroup
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.{PROD, CODE}
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import io.circe.{Decoder, Encoder}

sealed trait Product {
  val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Product]]]

  def getProductRatePlan[T <: Product](
      environment: TouchPointEnvironment,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions,
      productOptions: ProductOptions,
      readerType: ReaderType = Direct,
  ): Option[ProductRatePlan[Product]] =
    ratePlans(environment).filter(prp =>
      prp.billingPeriod == billingPeriod &&
        prp.fulfilmentOptions == fulfilmentOptions &&
        prp.productOptions == productOptions &&
        prp.readerType == readerType,
    ) match {
      case Nil => None
      case head :: Nil => Some(head)
      case _ =>
        throw new IllegalStateException(
          s"Multiple rate plans found for $this with billing period $billingPeriod, fulfilment options $fulfilmentOptions, product options $productOptions and reader type $readerType",
        )
    }

  def getProductRatePlans(environment: TouchPointEnvironment) = ratePlans(environment)

  def getProductRatePlanIds(environment: TouchPointEnvironment) = ratePlans(environment).map(_.id)

  def supportedCountries(environment: TouchPointEnvironment): List[CountryGroup] =
    ratePlans(environment)
      .flatMap(productRatePlan => productRatePlan.supportedTerritories)
      .distinct
}

case object TierThree extends Product {
  private def productRatePlan(
      id: String,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions,
      productOptions: ProductOptions,
  ) =
    ProductRatePlan(
      id,
      billingPeriod,
      fulfilmentOptions,
      productOptions,
      s"Tier Three ${billingPeriod.getClass.getSimpleName}",
    )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[SupporterPlus.type]]] =
    Map(
      PROD -> List(
        productRatePlan("8a1299788ff2ec100190025fccc32bb1", Monthly, Domestic, NoProductOptions),
        productRatePlan("8a1288a38ff2af980190025b32591ccc", Annual, Domestic, NoProductOptions),
        productRatePlan("8a128ab18ff2af9301900255d77979ac", Monthly, RestOfWorld, NoProductOptions),
        productRatePlan("8a1299788ff2ec100190024d1e3b1a09", Annual, RestOfWorld, NoProductOptions),
        productRatePlan("8a128dfb91f04b9a0191fa315d091c51", Monthly, Domestic, NewspaperArchive),
        productRatePlan("8a128dfb91f04b9a0191fa30ae2e1b7e", Annual, Domestic, NewspaperArchive),
        productRatePlan("8a12891291f04b9d0191fa2ffbe10975", Monthly, RestOfWorld, NewspaperArchive),
        productRatePlan("8a129c2591f06a5d0191fa2edb383026", Annual, RestOfWorld, NewspaperArchive),
      ),
      CODE -> List(
        productRatePlan("8ad097b48ff26452019001cebac92376", Monthly, Domestic, NoProductOptions),
        productRatePlan("8ad081dd8ff24a9a019001d95e4e3574", Annual, Domestic, NoProductOptions),
        productRatePlan("8ad081dd8ff24a9a019001df2ce83657", Monthly, RestOfWorld, NoProductOptions),
        productRatePlan("8ad097b48ff26452019001e65bbf2ca8", Annual, RestOfWorld, NoProductOptions),
        productRatePlan("8ad081dd91dae1d30191e0ce082d18d3", Monthly, Domestic, NewspaperArchive),
        productRatePlan("8ad097b491daf9180191e0cd58e5180b", Annual, Domestic, NewspaperArchive),
        productRatePlan("8ad097b491daf9180191e0cdba5f183c", Monthly, RestOfWorld, NewspaperArchive),
        productRatePlan("8ad097b491daf9180191e0cdf34e185e", Annual, RestOfWorld, NewspaperArchive),
      ),
    )
}

case object SupporterPlus extends Product {
  private def productRatePlan(
      id: String,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions = NoFulfilmentOptions,
  ) =
    ProductRatePlan(
      id,
      billingPeriod,
      fulfilmentOptions,
      NoProductOptions,
      s"Supporter Plus ${billingPeriod.getClass.getSimpleName}",
    )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[SupporterPlus.type]]] =
    Map(
      PROD -> List(
        productRatePlan("8a128ed885fc6ded018602296ace3eb8", Monthly),
        productRatePlan("8a128ed885fc6ded01860228f77e3d5a", Annual),
      ),
      CODE -> List(
        productRatePlan("8ad08cbd8586721c01858804e3275376", Monthly),
        productRatePlan("8ad08e1a8586721801858805663f6fab", Annual),
      ),
    )
}

case object GuardianAdLite extends Product {
  private def productRatePlan(id: String) =
    ProductRatePlan(
      id,
      Monthly,
      NoFulfilmentOptions,
      NoProductOptions,
      s"Guardian Ad-Lite Monthly",
    )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[GuardianAdLite.type]]] =
    Map(
      PROD -> List(
        productRatePlan("8a1285e294443da501944b04cb692c9e"),
      ),
      CODE -> List(
        productRatePlan("71a1bebf6be9444afad446c5ebaf0019"),
      ),
    )
}

case object DigitalPack extends Product {
  private def productRatePlan(
      id: String,
      billingPeriod: BillingPeriod,
      description: String,
  ) =
    ProductRatePlan(id, billingPeriod, NoFulfilmentOptions, NoProductOptions, description)

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[DigitalPack.type]]] =
    Map(
      PROD -> List(
        productRatePlan("2c92a0fb4edd70c8014edeaa4eae220a", Monthly, "Digital Subscription Monthly"),
        productRatePlan("2c92a0fb4edd70c8014edeaa4e972204", Annual, "Digital Subscription Annual"),
      ),
      CODE -> List(
        productRatePlan("2c92c0f84bbfec8b014bc655f4852d9d", Monthly, "Digital Subscription Monthly"),
        productRatePlan("2c92c0f94bbffaaa014bc6a4212e205b", Annual, "Digital Subscription Annual"),
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
      CODE -> List(
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

  private def nationalDelivery(
      productRatePlanId: ProductRatePlanId,
      productOptions: ProductOptions,
      description: String,
  ): ProductRatePlan[Paper.type] =
    ProductRatePlan(productRatePlanId, Monthly, NationalDelivery, productOptions, description, List(CountryGroup.UK))

  private val prodCollection: List[ProductRatePlan[Paper.type]] =
    List(
      collection("2c92a00870ec598001710740ce702ff0", SaturdayPlus, "Voucher Saturday+"),
      collection("2c92a00870ec598001710740cdd02fbd", Saturday, "Voucher Saturday"),
      collection("2c92a00870ec598001710740d0d83017", Sunday, "Voucher Sunday"),
      collection("2c92a00870ec598001710740c6672ee7", WeekendPlus, "Voucher Weekend+"),
      collection("2c92a00870ec598001710740d24b3022", Weekend, "Voucher Weekend"),
      collection("2c92a00870ec598001710740c4582ead", SixdayPlus, "Voucher Sixday+"),
      collection("2c92a00870ec598001710740ca532f69", Sixday, "Voucher Sixday"),
      collection("2c92a00870ec598001710740d3d03035", EverydayPlus, "Voucher Everyday+"),
      collection("2c92a00870ec598001710740c78d2f13", Everyday, "Voucher Everyday"),
    )

  private val codeCollection: List[ProductRatePlan[Paper.type]] = List(
    collection("2c92c0f86fa49142016fa49eb1732a39", SaturdayPlus, "Voucher Saturday paper+"),
    collection("2c92c0f86fa49142016fa49ea442291b", Saturday, "Voucher Saturday paper"),
    collection("2c92c0f86fa49142016fa49eb0a42a01", Sunday, "Voucher Sunday paper"),
    collection("2c92c0f86fa49142016fa49eaecb29dd", WeekendPlus, "Voucher Weekend+"),
    collection("2c92c0f86fa49142016fa49ea0d028b6", Weekend, "Voucher Weekend"),
    collection("2c92c0f86fa49142016fa49ea1af28c8", SixdayPlus, "Voucher Sixday+"),
    collection("2c92c0f86fa49142016fa49e9b9a286f", Sixday, "Voucher Sixday"),
    collection("2c92c0f86fa49142016fa49eaa492988", EverydayPlus, "Voucher Everyday+"),
    collection("2c92c0f86fa49142016fa49ea56a2938", Everyday, "Voucher Everyday"),
  )

  private val codeNationalDelivery: List[ProductRatePlan[Paper.type]] = List(
    nationalDelivery("8ad096ca8992481d018992a36256175e", Weekend, "National Delivery Weekend"),
    nationalDelivery("8ad096ca8992481d018992a35f60171b", Sixday, "National Delivery Sixday"),
    nationalDelivery("8ad096ca8992481d018992a363bd17ad", Everyday, "National Delivery Everyday"),
    nationalDelivery("71a1166283a96ab11606b50ebbb50381", WeekendPlus, "National Delivery Weekend+"),
    nationalDelivery("71a1383e2a796aafcb16b527842001ca", SixdayPlus, "National Delivery Sixday+"),
    nationalDelivery("71a116628be96ab11606b51ec6060555", EverydayPlus, "National Delivery Everyday+"),
  )

  private val prodNationalDelivery: List[ProductRatePlan[Paper.type]] = List(
    nationalDelivery("8a12999f8a268c57018a27ebe868150c", Weekend, "National Delivery Weekend"),
    nationalDelivery("8a12999f8a268c57018a27ebfd721883", Sixday, "National Delivery Sixday"),
    nationalDelivery("8a12999f8a268c57018a27ebe31414a4", Everyday, "National Delivery Everyday"),
    nationalDelivery("8a1280be96d33dbf0196d487b55c1283", WeekendPlus, "National Delivery Weekend+"),
    nationalDelivery("8a12994696d3587b0196d484491e3beb", SixdayPlus, "National Delivery Sixday+"),
    nationalDelivery("8a1280be96d33dbf0196d48a632616f4", EverydayPlus, "National Delivery Everyday+"),
  )

  private val codeHomeDelivery: List[ProductRatePlan[Paper.type]] = List(
    homeDelivery("2c92c0f961f9cf300161fc4f71473a34", SaturdayPlus, "Home Delivery Saturday+"),
    homeDelivery("2c92c0f961f9cf300161fc4d2e3e3664", Saturday, "Home Delivery Saturday"),
    homeDelivery("2c92c0f85aff3453015b1041dfd2317f", Sunday, "Home Delivery Sunday"),
    homeDelivery("2c92c0f95aff3b56015b104aa9a13ea5", WeekendPlus, "Home Delivery Weekend+"),
    homeDelivery("2c92c0f955c3cf0f0155c5d9df433bf7", Weekend, "Home Delivery Weekend"),
    homeDelivery("2c92c0f85aff33ff015b1042d4ba0a05", SixdayPlus, "Home Delivery Sixday+"),
    homeDelivery("2c92c0f955c3cf0f0155c5d9ddf13bc5", Sixday, "Home Delivery Sixday"),
    homeDelivery("2c92c0f85aff3453015b10496b5e3d17", EverydayPlus, "Home Delivery Everyday+"),
    homeDelivery("2c92c0f955c3cf0f0155c5d9e2493c43", Everyday, "Home Delivery Everyday"),
  )

  private val prodHomeDelivery: List[ProductRatePlan[Paper.type]] = List(
    homeDelivery("2c92a0ff6205708e01622484bb2c4613", SaturdayPlus, "Home Delivery Saturday+"),
    homeDelivery("2c92a0fd5e1dcf0d015e3cb39d0a7ddb", Saturday, "Home Delivery Saturday"),
    homeDelivery("2c92a0ff5af9b657015b0fea5b653f81", Sunday, "Home Delivery Sunday"),
    homeDelivery("2c92a0ff560d311b0156136b9f5c3968", WeekendPlus, "Home Delivery Weekend+"),
    homeDelivery("2c92a0fd5614305c01561dc88f3275be", Weekend, "Home Delivery Weekend"),
    homeDelivery("2c92a0ff560d311b0156136b697438a9", SixdayPlus, "Home Delivery Sixday+"),
    homeDelivery("2c92a0ff560d311b0156136f2afe5315", Sixday, "Home Delivery Sixday"),
    homeDelivery("2c92a0fd560d132301560e43cf041a3c", EverydayPlus, "Home Delivery Everyday+"),
    homeDelivery("2c92a0fd560d13880156136b72e50f0c", Everyday, "Home Delivery Everyday"),
  )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[Paper.type]]] =
    Map(
      PROD -> (prodCollection ++ prodHomeDelivery ++ prodNationalDelivery),
      CODE -> (codeCollection ++ codeHomeDelivery ++ codeNationalDelivery),
    )
}

case object GuardianWeekly extends Product {
  private def domestic(
      id: String,
      billingPeriod: BillingPeriod,
      description: String,
      readerType: ReaderType = Direct,
  ) = ProductRatePlan(
    id,
    billingPeriod,
    Domestic,
    NoProductOptions,
    description,
    readerType = readerType,
  )

  private def restOfWorld(
      id: String,
      billingPeriod: BillingPeriod,
      description: String,
      readerType: ReaderType = Direct,
  ) = ProductRatePlan(
    id,
    billingPeriod,
    RestOfWorld,
    NoProductOptions,
    description,
    readerType = readerType,
  )

  lazy val ratePlans: Map[TouchPointEnvironment, List[ProductRatePlan[GuardianWeekly.type]]] =
    Map(
      PROD -> List(
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
      CODE -> List(
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
  lazy val allProducts: List[Product] = List(DigitalPack, Contribution, GuardianWeekly, Paper, SupporterPlus, TierThree)

  def fromString(code: String): Option[Product] = allProducts.find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[Product] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised product '$code'"))
  implicit val encode: Encoder[Product] = Encoder.encodeString.contramap[Product](_.toString)
}
