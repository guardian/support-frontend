package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import com.gu.i18n.CountryGroup
import io.circe.generic.extras.Configuration

case class Image(
    mobileUrl: String,
    desktopUrl: String,
    tabletUrl: String,
    altText: String,
)

object Image {
  implicit val codec: Codec[Image] = deriveCodec
}

case class Institution(
    name: String,
    acronym: String,
    logoUrl: String,
)

object Institution {
  implicit val codec: Codec[Institution] = deriveCodec
}

// NOTE: only used here currently
// TODO: consider renaming regionId to countryGroupId
sealed trait CountryGroupId

object CountryGroupId {
  case object GBPCountries extends CountryGroupId
  case object UnitedStates extends CountryGroupId
  case object AUDCountries extends CountryGroupId
  case object EURCountries extends CountryGroupId
  case object International extends CountryGroupId
  case object NZDCountries extends CountryGroupId
  case object Canada extends CountryGroupId

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[CountryGroupId] = deriveEnumerationEncoder[CountryGroupId]
  implicit val decoder: Decoder[CountryGroupId] = deriveEnumerationDecoder[CountryGroupId]

  def getCountryGroup(countryGroupId: CountryGroupId): CountryGroup = {
    countryGroupId match {
      case GBPCountries => CountryGroup.UK
      case UnitedStates => CountryGroup.US
      case AUDCountries => CountryGroup.Australia
      case EURCountries => CountryGroup.Europe
      case International => CountryGroup.RestOfTheWorld
      case NZDCountries => CountryGroup.NewZealand
      case Canada => CountryGroup.Canada
    }
  }
}

case class StudentLandingPageVariant(
    name: String,
    heading: String,
    subheading: String,
    image: Image,
    institution: Institution,
    promoCodes: List[String],
)

object StudentLandingPageVariant {
  implicit val codec: Codec[StudentLandingPageVariant] = deriveCodec
}

case class StudentLandingPageTest(
    name: String,
    status: Status,
    priority: Int,
    regionId: CountryGroupId, // consider renaming to countryGroupId - SAC needs to be done first
    variants: List[StudentLandingPageVariant],
)

object StudentLandingPageTest {
  implicit val encoder: Encoder[StudentLandingPageTest] = deriveEncoder
  implicit val decoder: Decoder[StudentLandingPageTest] = deriveDecoder
}
