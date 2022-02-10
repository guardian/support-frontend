package com.gu.support.redemptions

import com.gu.support.encoding.Codec

case class RedemptionData(redemptionCode: RedemptionCode)

object RedemptionData {
  import Codec.deriveCodec
  implicit val codec: Codec[RedemptionData] = deriveCodec
}
