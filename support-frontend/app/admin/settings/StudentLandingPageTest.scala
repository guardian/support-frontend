package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

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

case class PromoCode(
    value: List[String],
)

object PromoCode {
  implicit val codec: Codec[PromoCode] = deriveCodec
}

case class StudentLandingPageVariant(
    name: String,
    heading: String,
    subheading: String,
    image: Image,
    institution: Institution,
    promoCodes: PromoCode,
)

object StudentLandingPageVariant {
  implicit val codec: Codec[StudentLandingPageVariant] = deriveCodec
}

case class StudentLandingPageTest(
    name: String,
    status: Status,
    priority: Int,
    //  check regionId is getting correct type.
    regionId: String,
    variants: List[StudentLandingPageVariant],
)

object StudentLandingPageTest {
  implicit val encoder: Encoder[StudentLandingPageTest] = deriveEncoder
  implicit val decoder: Decoder[StudentLandingPageTest] = deriveDecoder
}
