package com.gu.support.acquisitions

sealed abstract class AcquisitionType(val value: String)

object AcquisitionType {
  case object Purchase extends AcquisitionType("PURCHASE")
  case object Redemption extends AcquisitionType("REDEMPTION")
}
