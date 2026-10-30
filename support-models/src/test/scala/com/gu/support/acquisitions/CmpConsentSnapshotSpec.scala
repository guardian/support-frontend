package com.gu.support.acquisitions

import com.gu.support.SerialisationTestHelpers._
import com.gu.support.workers.Fixtures
import com.gu.support.workers.states.CreatePaymentMethodState
import io.circe.parser.decode
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class CmpConsentSnapshotSpec extends AnyFlatSpec with Matchers {
  it should "roundtrip a consent snapshot in the worker input state" in {
    val snapshot =
      """{"capturedAt":"2026-10-12T10:00:00.000Z","consentManagerVersion":"1.0.0","framework":"tcfv2","gpcSignal":true,"tcfv2":{"gdprApplies":true,"consents":{"1":true,"4":false},"vendorConsents":{"755":true,"999":false},"eventStatus":"useractioncomplete","addtlConsent":"1~755","tcString":"encoded-consent"}}"""
    val workerInput = Fixtures
      .createStripePaymentMethodContributionJson()
      .replace(
        "\"similarProductsConsent\": false",
        s"\"similarProductsConsent\": false, \"cmpConsentSnapshot\": $snapshot",
      )

    val state = decode[CreatePaymentMethodState](workerInput) match {
      case Right(value) => value
      case Left(error) => fail(error.getMessage)
    }

    state.similarProductsConsent shouldBe Some(false)
    state.cmpConsentSnapshot.map(_.framework) shouldBe Some("tcfv2")
    state.cmpConsentSnapshot.flatMap(_.tcfv2).map(_.vendorConsents) shouldBe Some(Map("755" -> true, "999" -> false))
    testRoundTripSerialisation(state)
  }
}
