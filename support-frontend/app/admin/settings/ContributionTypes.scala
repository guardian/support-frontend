package admin.settings

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.{Codec, JsonHelpers}
import io.circe.{Decoder, Encoder}

sealed trait ContributionType
case object ONE_OFF extends ContributionType
case object MONTHLY extends ContributionType
case object ANNUAL extends ContributionType

case object ContributionType {
  implicit val contributionTypeEncoder: Encoder[ContributionType] =
    Encoder.encodeString.contramap[ContributionType](_.toString)

  implicit val contributionTypeDecoder: Decoder[ContributionType] = JsonHelpers.decodeStringAndCollect {
    case "ONE_OFF" => ONE_OFF
    case "MONTHLY" => MONTHLY
    case "ANNUAL" => ANNUAL
  }
}

case class ContributionTypeSetting(contributionType: ContributionType, isDefault: Option[Boolean])
object ContributionTypeSetting {
  implicit val contributionTypeSettingDecoder: Codec[ContributionTypeSetting] = deriveCodec

}

case class ContributionTypes(
    GBPCountries: Seq[ContributionTypeSetting],
    UnitedStates: Seq[ContributionTypeSetting],
    EURCountries: Seq[ContributionTypeSetting],
    International: Seq[ContributionTypeSetting],
    Canada: Seq[ContributionTypeSetting],
    AUDCountries: Seq[ContributionTypeSetting],
    NZDCountries: Seq[ContributionTypeSetting],
)

object ContributionTypes {
  implicit val contributionTypesCodec: Codec[ContributionTypes] = deriveCodec
}
