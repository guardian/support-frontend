package com.gu.support.acquisitions

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Tcfv2ConsentSnapshot(
    gdprApplies: Option[Boolean],
    consents: Map[String, Boolean],
    vendorConsents: Map[String, Boolean],
    eventStatus: String,
    addtlConsent: String,
    tcString: String,
)

object Tcfv2ConsentSnapshot {
  implicit val codec: Codec[Tcfv2ConsentSnapshot] = deriveCodec
}

case class UsnatConsentSnapshot(
    doNotSell: Boolean,
    signalStatus: String,
)

object UsnatConsentSnapshot {
  implicit val codec: Codec[UsnatConsentSnapshot] = deriveCodec
}

case class AusConsentSnapshot(
    personalisedAdvertising: Boolean,
    signalStatus: String,
)

object AusConsentSnapshot {
  implicit val codec: Codec[AusConsentSnapshot] = deriveCodec
}

case class CmpConsentSnapshot(
    capturedAt: String,
    consentManagerVersion: String,
    framework: String,
    gpcSignal: Option[Boolean],
    tcfv2: Option[Tcfv2ConsentSnapshot],
    usnat: Option[UsnatConsentSnapshot],
    aus: Option[AusConsentSnapshot],
)

object CmpConsentSnapshot {
  implicit val codec: Codec[CmpConsentSnapshot] = deriveCodec
}
