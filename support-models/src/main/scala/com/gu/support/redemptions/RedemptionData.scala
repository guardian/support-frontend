package com.gu.support.redemptions

import cats.syntax.functor._
import com.gu.support.encoding.Codec
import com.gu.support.redemptions.redemptions.{CorporateAccountId, RedemptionCode}
import com.gu.support.zuora.api.{ReaderType, Subscription}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

sealed abstract class RedemptionData(val redemptionCode: RedemptionCode)

case class CorporateRedemption(override val redemptionCode: RedemptionCode, corporateAccountId: CorporateAccountId) extends RedemptionData(redemptionCode)

object RedemptionData {
    import Codec.deriveCodec
    import com.gu.support.encoding.CustomCodecs.{decodeCountry, encodeCountryAsAlpha2}
    implicit val corporateCodec: Codec[CorporateRedemption] = deriveCodec

    implicit val encoder: Encoder[RedemptionData] = Encoder.instance {
      case c: CorporateRedemption => c.asJson
    }

    implicit val decoder: Decoder[RedemptionData] =
      List[Decoder[RedemptionData]](
        Decoder[CorporateRedemption].widen
      ).reduceLeft(_ or _)
}
