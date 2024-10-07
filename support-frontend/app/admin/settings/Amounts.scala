package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.extras.Configuration

case class AmountsSelection(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Option[Boolean],
)

case class ContributionAmounts(
    ONE_OFF: AmountsSelection,
    MONTHLY: AmountsSelection,
    ANNUAL: AmountsSelection,
)

case class AmountsVariant(
    variantName: String,
    defaultContributionType: String,
    displayContributionType: List[String],
    amountsCardData: ContributionAmounts,
)

sealed trait AmountsTestTargeting

object AmountsTestTargeting {
  case class Region(targetingType: String = "Region", region: String) extends AmountsTestTargeting
  case class Country(targetingType: String = "Country", countries: List[String]) extends AmountsTestTargeting

  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("targetingType")

  implicit val amountsTestTargetingCodec: Codec[AmountsTestTargeting] = deriveCodec[AmountsTestTargeting]
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
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val amountsSelectionCodec: Codec[AmountsSelection] = deriveCodec[AmountsSelection]
  implicit val contributionAmountsCodec: Codec[ContributionAmounts] = deriveCodec[ContributionAmounts]
  implicit val amountsVariantCodec: Codec[AmountsVariant] = deriveCodec[AmountsVariant]
  implicit val amountsTestCodec: Codec[AmountsTest] = deriveCodec[AmountsTest]
  implicit val amountsTestsCodec: Codec[AmountsTests] = deriveCodec[AmountsTests]
}
