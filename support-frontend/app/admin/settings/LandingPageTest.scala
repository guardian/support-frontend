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

case class RegionTargeting(
    targetedCountryGroups: List[String] = Nil,
)

object RegionTargeting {
  implicit val codec: Codec[RegionTargeting] = deriveCodec
}

case class LandingPageCopy(
    heading: String,
    subheading: String,
)

object LandingPageCopy {
  implicit val codec: Codec[LandingPageCopy] = deriveCodec
}

case class ProductBenefit(
    copy: String,
    tooltip: Option[String] = None,
    label: Option[Label] = None,
)

case class Label(
    copy: String,
)

case class LandingPageProductDescription(
    title: String,
    label: Option[Label] = None,
    benefits: List[ProductBenefit],
    cta: Cta,
)

case class Cta(
    copy: String,
)

case class CountdownTheme(
    backgroundColor: String,
    foregroundColor: String,
)
object CountdownTheme {
  implicit val codec: Codec[CountdownTheme] = deriveCodec
}
case class CountdownSettings(
    overwriteHeadingLabel: String,
    countdownStartTimestamp: String,
    countdownDeadlineTimestamp: String,
    useLocalTime: Boolean,
    theme: CountdownTheme,
)
object CountdownSettings {
  implicit val countdownCodec: Codec[CountdownSettings] = deriveCodec
}
case class TickerCopy(
    countLabel: String,
    goalCopy: String,
)
object TickerCopy {
  implicit val codec: Codec[TickerCopy] = deriveCodec
}
case class TickerSettings(
    currencySymbol: String,
    copy: TickerCopy,
    name: String,
)
object TickerSettings {
  implicit val tickerCodec: Codec[TickerSettings] = deriveCodec
}
case class Products(
    Contribution: Option[LandingPageProductDescription],
    SupporterPlus: Option[LandingPageProductDescription],
    DigitalSubscription: Option[LandingPageProductDescription],
)

object Products {
  implicit val benefitCodec: Codec[ProductBenefit] = deriveCodec
  implicit val labelCodec: Codec[Label] = deriveCodec
  implicit val descriptionCodec: Codec[LandingPageProductDescription] = deriveCodec
  implicit val ctaCodec: Codec[Cta] = deriveCodec
  implicit val codec: Codec[Products] = deriveCodec
}

case class LandingPageVariant(
    name: String,
    copy: LandingPageCopy,
    products: Products,
    tickerSettings: Option[TickerSettings],
    countdownSettings: Option[CountdownSettings],
)

object LandingPageVariant {
  implicit val codec: Codec[LandingPageVariant] = deriveCodec
}

case class LandingPageTest(
    name: String,
    status: Status,
    priority: Int,
    regionTargeting: Option[RegionTargeting],
    variants: List[LandingPageVariant],
)

object LandingPageTest {
  implicit val encoder: Encoder[LandingPageTest] = deriveEncoder
  implicit val decoder: Decoder[LandingPageTest] = deriveDecoder
}
