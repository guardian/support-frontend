package com.gu.acquisition.model

import io.circe.Json
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}
import org.scalatest.{Matchers, WordSpecLike}

class ReferrerAcquisitionSpec extends WordSpecLike with Matchers {

  val referrerAcquisitionData = ReferrerAcquisitionData(
    campaignCode = Some("campaign_code"),
    referrerPageviewId = Some("referrer_pageview_id"),
    referrerUrl = Some("referrer_url"),
    componentId = Some("component_id"),
    componentType = Some(ComponentType.AcquisitionsEpic),
    source = Some(AcquisitionSource.GuardianWeb),
    abTest = Some(AbTest("test_name", "variant_name"))
  )

  val referrerAcquisitionJson = Json.obj(
    "campaignCode" -> Json.fromString("campaign_code"),
    "referrerPageviewId" -> Json.fromString("referrer_pageview_id"),
    "referrerUrl" -> Json.fromString("referrer_url"),
    "componentId" -> Json.fromString("component_id"),
    "componentType" -> Json.fromString("ACQUISITIONS_EPIC"),
    "source" -> Json.fromString("GUARDIAN_WEB"),
    "abTest" -> Json.obj(
      "name" -> Json.fromString("test_name"),
      "variant" -> Json.fromString("variant_name")
    )
  )

  "Referrer acquisition data" should {

    "be able to be encoded as JSON" in {
      import io.circe.syntax._

      referrerAcquisitionData.asJson shouldEqual referrerAcquisitionJson
    }

    "be able to be decoded from JSON" in {
      referrerAcquisitionJson.as[ReferrerAcquisitionData] shouldEqual Right(referrerAcquisitionData)
    }
  }
}
