package admin.settings

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.{Codec, DiscriminatedType}

case class AmountsSelection(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Option[Boolean],
)

object AmountsSelection {
  implicit val codec: Codec[AmountsSelection] = deriveCodec
}

case class ContributionAmounts(
    ONE_OFF: AmountsSelection,
    MONTHLY: AmountsSelection,
    ANNUAL: AmountsSelection,
)

object ContributionAmounts {
  implicit val codec: Codec[ContributionAmounts] = deriveCodec
}

case class AmountsVariant(
    variantName: String,
    defaultContributionType: String,
    displayContributionType: List[String],
    amountsCardData: ContributionAmounts,
)

object AmountsVariant {
  implicit val codec: Codec[AmountsVariant] = deriveCodec
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

object AmountsTest {
  implicit val codec: Codec[AmountsTest] = deriveCodec
}

object AmountsTests {
  type AmountsTests = List[AmountsTest]
  implicit val codec: Codec[AmountsTests] = deriveCodec
}
