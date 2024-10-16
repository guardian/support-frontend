package admin.settings

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.{Codec, DiscriminatedType}
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class AmountsSelection(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Option[Boolean],
)

object AmountsSelection {
  implicit val codec: Codec[AmountsSelection] = deriveCodec[AmountsSelection]
}

case class ContributionAmounts(
    ONE_OFF: AmountsSelection,
    MONTHLY: AmountsSelection,
    ANNUAL: AmountsSelection,
)

object ContributionAmounts {
  implicit val codec: Codec[ContributionAmounts] = deriveCodec[ContributionAmounts]
}

case class AmountsVariant(
    variantName: String,
    defaultContributionType: String,
    displayContributionType: List[String],
    amountsCardData: ContributionAmounts,
)

object AmountsVariant {
  implicit val codec: Codec[AmountsVariant] = deriveCodec[AmountsVariant]
}

sealed trait AmountsTestTargeting

object AmountsTestTargeting {
  case class Region(targetingType: String = "Region", region: String) extends AmountsTestTargeting
  case class Country(targetingType: String = "Country", countries: List[String]) extends AmountsTestTargeting

  private val discriminatedType = new DiscriminatedType[AmountsTestTargeting]("targetingType")
  implicit val codec: Codec[AmountsTestTargeting] = discriminatedType.codec(
    List(
      discriminatedType.variant[Region]("Region"),
      discriminatedType.variant[Country]("Country"),
    ),
  )
}

case class AmountsTest(
    testName: String,
    liveTestName: Option[String],
    testLabel: Option[String],
    isLive: Boolean,
    targeting: AmountsTestTargeting,
    order: Int,
    seed: Int,
    variants: List[AmountsVariant],
)

object AmountsTests {
  type AmountsTests = List[AmountsTest]
  implicit val amountsTestDecoder: Decoder[AmountsTest] = deriveDecoder[AmountsTest]
  implicit val amountsTestEncoder: Encoder.AsObject[AmountsTest] = deriveEncoder[AmountsTest]
  implicit val amountsTestsDecoder: Decoder[AmountsTests] = deriveDecoder[AmountsTests]
  implicit val amountsTestsEncoder: Encoder.AsObject[AmountsTests] = deriveEncoder[AmountsTests]
}
