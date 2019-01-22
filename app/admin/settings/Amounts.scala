package admin.settings

import io.circe.{Decoder, Encoder}

case class Amount(value: Int, isDefault: Option[Boolean])
case class AmountsRegions(
  GBPCountries: List[Amount],
  UnitedStates: List[Amount],
  EURCountries: List[Amount],
  AUDCountries: List[Amount],
  International: List[Amount],
  NZDCountries: List[Amount],
  Canada: List[Amount]
)
case class Amounts(ONE_OFF: AmountsRegions, MONTHLY: AmountsRegions, ANNUAL: AmountsRegions)

object Amounts {
  import io.circe.generic.auto._

  implicit val amountsEncoder = Encoder[Amounts]
  implicit val amountsDecoder = Decoder[Amounts]
}
