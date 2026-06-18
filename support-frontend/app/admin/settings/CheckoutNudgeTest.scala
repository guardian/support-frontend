package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{
  deriveConfiguredDecoder,
  deriveConfiguredEncoder,
  deriveEnumerationDecoder,
  deriveEnumerationEncoder,
}
import io.circe.{Decoder, Encoder}

sealed trait ProductType

object ProductType {
  case object OneTimeContribution extends ProductType
  case object Contribution extends ProductType
  case object SupporterPlus extends ProductType
  case object DigitalSubscription extends ProductType

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[ProductType] = deriveEnumerationEncoder[ProductType]
  implicit val decoder: Decoder[ProductType] = deriveEnumerationDecoder[ProductType]
}

sealed trait RatePlan

object RatePlan {
  case object OneTime extends RatePlan
  case object Monthly extends RatePlan
  case object Annual extends RatePlan

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[RatePlan] = deriveEnumerationEncoder[RatePlan]
  implicit val decoder: Decoder[RatePlan] = deriveEnumerationDecoder[RatePlan]
}

case class Product(
    product: ProductType,
    ratePlan: Option[RatePlan] = None,
)

object Product {
  implicit val codec: Codec[Product] = deriveCodec
}

case class Copy(
    heading: String,
    body: Option[String] = None,
)

object Copy {
  implicit val codec: Codec[Copy] = deriveCodec
}

case class Benefits(
    label: String,
)

object Benefits {
  implicit val codec: Codec[Benefits] = deriveCodec
}

case class CheckoutNudge(
    nudgeCopy: Copy,
    thankyouCopy: Copy,
    benefits: Option[Benefits] = None,
    nudgeToProduct: Product,
)

object CheckoutNudge {
  implicit val codec: Codec[CheckoutNudge] = deriveCodec
}

case class CheckoutNudgeVariant(
    name: String,
    nudge: Option[CheckoutNudge] = None,
    promoCodes: Option[List[String]] = None,
)

object CheckoutNudgeVariant {
  implicit val codec: Codec[CheckoutNudgeVariant] = deriveCodec
}

case class CheckoutNudgeTest(
    name: String,
    status: Status,
    priority: Int,
    regionTargeting: Option[RegionTargeting] = None,
    nudgeFromProduct: Product,
    variants: List[CheckoutNudgeVariant],
)

object CheckoutNudgeTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[CheckoutNudgeTest] = deriveConfiguredEncoder[CheckoutNudgeTest]
  implicit val decoder: Decoder[CheckoutNudgeTest] = deriveConfiguredDecoder[CheckoutNudgeTest]
}
