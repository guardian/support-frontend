package com.gu.support.workers.redemption

import cats.syntax.functor._
import com.gu.support.encoding.Codec
import com.gu.support.zuora.api.{ReaderType, Subscription}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

abstract class RedemptionData(val redemptionCode: RedemptionCode) {
  def redeem(subscription: Subscription) = subscription.copy(redemptionCode = Some(redemptionCode))
}

case class CorporateRedemption(override val redemptionCode: RedemptionCode, corporateAccountId: CorporateAccountId) extends RedemptionData(redemptionCode) {
  override def redeem(subscription: Subscription) =
    super.redeem(subscription)
      .copy(
        corporateAccountId = Some(corporateAccountId),
        readerType = ReaderType.Corporate
      )
}

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
