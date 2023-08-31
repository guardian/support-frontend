package admin.settings

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}

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

  import io.circe.generic.extras.auto._
  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("targetingType")

  implicit val amountsTestTargetingDecoder = Decoder[AmountsTestTargeting]
  implicit val amountsTestTargetingEncoder = Encoder[AmountsTestTargeting]
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
  implicit val amountsTestDecoder = Decoder[AmountsTest]
  implicit val amountsTestEncoder = Encoder[AmountsTest]
  implicit val amountsTestsDecoder = Decoder[AmountsTests]
  implicit val amountsTestsEncoder = Encoder[AmountsTests]
}
