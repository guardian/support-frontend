package admin.settings

import io.circe.{Decoder, Encoder}

case class Amount(value: String, isDefault: Option[Boolean])

case class Amounts(ONE_OFF: List[Amount], MONTHLY: List[Amount], ANNUAL: List[Amount])

case class AmountsRegions(
  GBPCountries: Amounts,
  UnitedStates: Amounts,
  EURCountries: Amounts,
  AUDCountries: Amounts,
  International: Amounts,
  NZDCountries: Amounts,
  Canada: Amounts
)

object Amounts {
  import io.circe.generic.auto._

  implicit val amountsEncoder = Encoder[AmountsRegions]
  implicit val amountsDecoder = Decoder[AmountsRegions]
}
