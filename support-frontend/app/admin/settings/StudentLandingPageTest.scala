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
    regionId: String,
    // TODO: does this need to be a proper RegionId - see PageTest<variant> interface in
    // support-frontend/assets/helpers/abTests/models.ts/PageTest/regionTargeting
    // it's optional tho
    variants: List[StudentLandingPageVariant],
)

object StudentLandingPageTest {
  implicit val encoder: Encoder[StudentLandingPageTest] = deriveEncoder
  implicit val decoder: Decoder[StudentLandingPageTest] = deriveDecoder
}
