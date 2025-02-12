package admin.settings

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.JsonHelpers
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import com.gu.support.encoding.Codec

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
  implicit val codec: Codec[ContributionTypeSetting] = deriveCodec[ContributionTypeSetting]
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
  import ContributionType._

  implicit val contributionTypesDecoder: Decoder[ContributionTypes] = deriveDecoder
  implicit val contributionTypesEncoder: Encoder[ContributionTypes] = deriveEncoder
}
