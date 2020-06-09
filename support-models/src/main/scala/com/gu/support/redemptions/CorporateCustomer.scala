package com.gu.support.redemptions

import com.gu.support.redemptions.redemptions.{CorporateAccountId, RedemptionCode}

case class CorporateCustomer(accountId: CorporateAccountId, name: String, redemptionCode: RedemptionCode)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CorporateCustomer {
  implicit val codec: Codec[CorporateCustomer] = deriveCodec
}
