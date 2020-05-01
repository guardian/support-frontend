package com.gu.support.workers

import cats.syntax.functor._
import com.gu.support.encoding.Codec
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

abstract class RedemptionData(redemptionCode: String)

case class Corporate(redemptionCode: String, corporateAccountId: String) extends RedemptionData(redemptionCode)

object RedemptionData {
    import Codec.deriveCodec
    import com.gu.support.encoding.CustomCodecs.{decodeCountry, encodeCountryAsAlpha2}
    implicit val corporateCodec: Codec[Corporate] = deriveCodec

    implicit val encoder: Encoder[RedemptionData] = Encoder.instance {
      case c: Corporate => c.asJson
    }

    implicit val decoder: Decoder[RedemptionData] =
      List[Decoder[RedemptionData]](
        Decoder[Corporate].widen
      ).reduceLeft(_ or _)
}
