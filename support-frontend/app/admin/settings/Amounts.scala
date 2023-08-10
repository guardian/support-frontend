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

case class AmountsTest(
    testName: String,
    liveTestName: Option[String],
    isLive: Boolean,
    region: String,
    country: List[String],
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
