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

case class Products(
    Contribution: LandingPageProductDescription,
    SupporterPlus: LandingPageProductDescription,
    TierThree: LandingPageProductDescription,
)

object Products {
  val defaultProducts: Products = Products(
    Contribution = LandingPageProductDescription(
      title = "Support",
      benefits = List(
        ProductBenefit(copy = "Give to the Guardian every month with Support"),
      ),
      cta = Cta(copy = "Support"),
    ),
    SupporterPlus = LandingPageProductDescription(
      title = "All-access digital!!",
      benefits = List(
        ProductBenefit(
          copy = "Unlimited access to the Guardian app",
          tooltip = Some(
            "Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.",
          ),
        ),
        ProductBenefit(copy = "Ad-free reading on all your devices"),
        ProductBenefit(copy = "Exclusive newsletter for supporters, sent every week from the Guardian newsroom"),
        ProductBenefit(
          copy = "Far fewer asks for support",
          tooltip = Some("You'll see far fewer financial support asks at the bottom of articles or in pop-up banners."),
        ),
        ProductBenefit(
          copy = "Unlimited access to the Guardian Feast app",
          tooltip = Some(
            "Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.",
          ),
          label = Some(Label(copy = "New")),
        ),
      ),
      cta = Cta(copy = "Support"),
      label = Some(Label(copy = "Recommended")),
    ),
    TierThree = LandingPageProductDescription(
      title = "Digital + print",
      benefits = List(
        ProductBenefit(
          copy = "Guardian Weekly print magazine delivered to your door every week",
          tooltip = Some(
            "Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.",
          ),
        ),
      ),
      cta = Cta(copy = "Support"),
    ),
  )

  implicit val benefitCodec: Codec[ProductBenefit] = deriveCodec
  implicit val labelCodec: Codec[Label] = deriveCodec
  implicit val descriptionCodec: Codec[LandingPageProductDescription] = deriveCodec
  implicit val ctaCodec: Codec[Cta] = deriveCodec
  implicit val codec: Codec[Products] = deriveCodec
}

case class LandingPageVariant(
    name: String,
    copy: LandingPageCopy,
    products: Option[Products],
)

object LandingPageVariant {
  // Add hardcoded products config until the tool supports this
  implicit val decoder = deriveDecoder[LandingPageVariant].map { variant =>
    LandingPageVariant(
      name = variant.name,
      copy = variant.copy,
      products = variant.products.orElse(Some(Products.defaultProducts)),
    )
  }
  implicit val encoder: Encoder[LandingPageVariant] = deriveEncoder
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
