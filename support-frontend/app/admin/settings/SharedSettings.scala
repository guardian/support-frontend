package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait Status
object Status {
  case object Live extends Status
  case object Draft extends Status

  implicit val statusEncoder: Encoder[Status] = deriveEnumerationEncoder[Status]
  implicit val statusDecoder: Decoder[Status] = deriveEnumerationDecoder[Status]
}

case class RegionTargeting(
    targetedCountryGroups: List[String] = Nil,
)

object RegionTargeting {
  implicit val codec: Codec[RegionTargeting] = deriveCodec
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
