package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

sealed trait Status
object Status {
  case object Live extends Status
  case object Draft extends Status

  implicit val statusEncoder = deriveEnumerationEncoder[Status]
  implicit val statusDecoder = deriveEnumerationDecoder[Status]
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
    priority: Int,
    targeting: LandingPageTestTargeting,
    variants: List[LandingPageVariant],
)

object LandingPageTest {
  implicit val encoder: Encoder[LandingPageTest] = deriveEncoder
  implicit val decoder: Decoder[LandingPageTest] = deriveDecoder
}

// TODO - fetch config from dynamodb instead of hardcoding here
object LandingPageTestsProvider extends SettingsProvider[List[LandingPageTest]] {
  def settings(): List[LandingPageTest] = List(
    LandingPageTest(
      name = "LP_DEFAULT_US",
      status = Status.Live,
      targeting = LandingPageTestTargeting(countryGroups = List("UnitedStates")),
      variants = List(
        LandingPageVariant(
          name = "CONTROL",
          copy = LandingPageCopy(
            heading = "Protect fearless, independent journalism",
            subheading =
              "We're not owned by a billionaire or profit-driven corporation: our fiercely independent journalism is funded by our readers. Monthly giving makes the most impact (and you can cancel anytime). Thank you.",
          ),
        ),
      ),
    ),
    LandingPageTest(
      name = "LP_DEFAULT",
      status = Status.Live,
      targeting = LandingPageTestTargeting(countryGroups =
        List("GBPCountries", "AUDCountries", "EURCountries", "International", "NZDCountries", "Canada"),
      ),
      variants = List(
        LandingPageVariant(
          name = "CONTROL",
          copy = LandingPageCopy(
            heading = "Support fearless, independent journalism",
            subheading =
              "We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. <strong>Cancel anytime.</strong>",
          ),
        ),
      ),
    ),
  )
}
