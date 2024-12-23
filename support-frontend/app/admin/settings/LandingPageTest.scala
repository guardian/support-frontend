package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

sealed trait Status
object Status {
  case object Live extends Status
  case object Draft extends Status

  implicit val decoder: Decoder[Status] = Decoder[String].emap {
    case "Live" => Right(Live)
    case "Draft" => Right(Draft)
    case other => Left(s"Invalid Status: $other")
  }
  implicit val encoder: Encoder[Status] = Encoder[String].contramap { s =>
    println(s"encoding $s")
    s match {
      case Live => "Live"
      case Draft => "Draft"
    }
  }
}

case class LandingPageTestTargeting(
    countryGroups: List[String],
)

object LandingPageTestTargeting {
  implicit val codec: Codec[LandingPageTestTargeting] = deriveCodec
}

case class LandingPageCopy(
    heading: String,
    subheading: String,
)

object LandingPageCopy {
  implicit val codec: Codec[LandingPageCopy] = deriveCodec
}

case class LandingPageVariant(
    name: String,
    copy: LandingPageCopy,
)

object LandingPageVariant {
  implicit val codec: Codec[LandingPageVariant] = deriveCodec
}

case class LandingPageTest(
    name: String,
    status: Status,
    targeting: LandingPageTestTargeting,
    variants: List[LandingPageVariant],
)

object LandingPageTest {
  implicit val encoder: Encoder[LandingPageTest] = deriveEncoder
  implicit val decoder: Decoder[LandingPageTest] = deriveDecoder
}

object LandingPageTestsProvider extends SettingsProvider[List[LandingPageTest]] {
  def settings(): List[LandingPageTest] = List(
    LandingPageTest(
      name = "MY_TEST",
      status = Status.Live,
      targeting = LandingPageTestTargeting(countryGroups = List("GBPCountries")),
      variants = List(
        LandingPageVariant(
          name = "CONTROL",
          copy = LandingPageCopy(
            heading = "My heading",
            subheading = "Subheading",
          ),
        ),
      ),
    ),
  )
}
