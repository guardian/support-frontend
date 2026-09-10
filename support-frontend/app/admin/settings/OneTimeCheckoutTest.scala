package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class AmountsSelection(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Boolean = false,
    mParticleAmountAttribute: Option[MParticleAmountAttribute] = None,
)

object AmountsSelection {
  implicit val encoder: Encoder[AmountsSelection] = deriveEncoder
  implicit val decoder: Decoder[AmountsSelection] = Decoder.instance { cursor =>
    for {
      amounts <- cursor.get[List[Int]]("amounts")
      defaultAmount <- cursor.get[Int]("defaultAmount")
      hideChooseYourAmount <- cursor
        .get[Option[Boolean]]("hideChooseYourAmount")
        .map(_.getOrElse(false))
      mParticleAmountAttribute <- cursor.get[Option[MParticleAmountAttribute]](
        "mParticleAmountAttribute",
      )
    } yield AmountsSelection(
      amounts,
      defaultAmount,
      hideChooseYourAmount,
      mParticleAmountAttribute,
    )
  }
  implicit val codec: Codec[AmountsSelection] = new Codec(encoder, decoder)
}

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
