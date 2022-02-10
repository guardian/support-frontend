package admin.settings

import io.circe.{Decoder, Encoder}

case class AmountsSelection(amounts: List[Int], defaultAmount: Int)

case class ContributionAmounts(
    ONE_OFF: AmountsSelection,
    MONTHLY: AmountsSelection,
    ANNUAL: AmountsSelection,
)

case class AmountsTestVariant(name: String, amounts: ContributionAmounts)

case class AmountsTest(name: String, isLive: Boolean, variants: List[AmountsTestVariant], seed: Int)

case class ConfiguredRegionAmounts(control: ContributionAmounts, test: Option[AmountsTest])

case class ConfiguredAmounts(
    GBPCountries: ConfiguredRegionAmounts,
    UnitedStates: ConfiguredRegionAmounts,
    EURCountries: ConfiguredRegionAmounts,
    AUDCountries: ConfiguredRegionAmounts,
    International: ConfiguredRegionAmounts,
    NZDCountries: ConfiguredRegionAmounts,
    Canada: ConfiguredRegionAmounts,
)

object Amounts {
  import io.circe.generic.auto._

  implicit val amountsEncoder = Encoder[ConfiguredAmounts]
  implicit val amountsDecoder = Decoder[ConfiguredAmounts]
}
