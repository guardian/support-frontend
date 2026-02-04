package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class SingleCheckoutVariant(
    name: String,
    heading: String,
    subheading: String,
    amounts: AmountsSelection,
    tickerSettings: Option[TickerSettings],
)

object SingleCheckoutVariant {
  implicit val codec: Codec[SingleCheckoutVariant] = deriveCodec
}

case class SingleCheckoutTest(
    name: String,
    status: Status,
    priority: Int,
    regionTargeting: Option[RegionTargeting],
    variants: List[SingleCheckoutVariant],
)

object SingleCheckoutTest {
  implicit val encoder: Encoder[SingleCheckoutTest] = deriveEncoder
  implicit val decoder: Decoder[SingleCheckoutTest] = deriveDecoder
}
