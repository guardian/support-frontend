package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class OneTimeCheckoutVariant(
    name: String,
    heading: String,
    subheading: String,
    amounts: AmountsSelection,
    tickerSettings: Option[TickerSettings],
)

object OneTimeCheckoutVariant {
  implicit val codec: Codec[OneTimeCheckoutVariant] = deriveCodec
}

case class OneTimeCheckoutTest(
    name: String,
    status: Status,
    priority: Int,
    regionTargeting: Option[RegionTargeting],
    variants: List[OneTimeCheckoutVariant],
)

object OneTimeCheckoutTest {
  implicit val encoder: Encoder[OneTimeCheckoutTest] = deriveEncoder
  implicit val decoder: Decoder[OneTimeCheckoutTest] = deriveDecoder
}
