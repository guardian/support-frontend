package com.gu.acquisition.model

import io.circe.{Json => CJson}
import play.api.libs.json.{JsObject, Json => PJson}
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}
import org.scalatest.{EitherValues, Matchers, WordSpecLike}

class ReferrerAcquisitionSpec extends WordSpecLike with Matchers with EitherValues {

  val referrerAcquisitionData = ReferrerAcquisitionData(
    campaignCode = Some("campaign_code"),
    referrerPageviewId = Some("referrer_pageview_id"),
    referrerUrl = Some("referrer_url"),
    componentId = Some("component_id"),
    componentType = Some(ComponentType.AcquisitionsEpic),
    source = Some(AcquisitionSource.GuardianWeb),
    abTest = Some(AbTest("test_name", "variant_name")),
    abTests = Some(Set(AbTest("test_name", "variant_name"), AbTest("test_name2", "variant_name2")))
  )

  val referrerAcquisitionCJson: CJson = CJson.obj(
    "campaignCode" -> CJson.fromString("campaign_code"),
    "referrerPageviewId" -> CJson.fromString("referrer_pageview_id"),
    "referrerUrl" -> CJson.fromString("referrer_url"),
    "componentId" -> CJson.fromString("component_id"),
    "componentType" -> CJson.fromString("ACQUISITIONS_EPIC"),
    "source" -> CJson.fromString("GUARDIAN_WEB"),
    "abTest" -> CJson.obj(
      "name" -> CJson.fromString("test_name"),
      "variant" -> CJson.fromString("variant_name")
    ),
    "abTests" -> CJson.arr(
      CJson.obj(
        "name" -> CJson.fromString("test_name"),
        "variant" -> CJson.fromString("variant_name")
      ),
      CJson.obj(
        "name" -> CJson.fromString("test_name2"),
        "variant" -> CJson.fromString("variant_name2")
      )
    )
  )

  val referrerAcquisitionPJson: JsObject = PJson.obj(
    "campaignCode" -> "campaign_code",
    "referrerPageviewId" -> "referrer_pageview_id",
    "referrerUrl" -> "referrer_url",
    "componentId" -> "component_id",
    "componentType" -> "ACQUISITIONS_EPIC",
    "source" -> "GUARDIAN_WEB",
    "abTest" -> PJson.obj(
      "name" -> "test_name",
      "variant" -> "variant_name"
    ),
    "abTests" -> PJson.arr(
      PJson.obj(
        "name" -> "test_name",
        "variant" -> "variant_name"
      ),
      PJson.obj(
        "name" -> "test_name2",
        "variant" -> "variant_name2"
      )
    )
  )

  "Referrer acquisition data" should {

    "be able to be encoded as JSON using circe" in {
      import io.circe.syntax._

      referrerAcquisitionData.asJson shouldEqual referrerAcquisitionCJson
    }

    "be able to be decoded from JSON using circe" in {

      referrerAcquisitionCJson.as[ReferrerAcquisitionData].right.value shouldEqual referrerAcquisitionData
    }

    "be able to be encoded as JSON using Play" in {

      PJson.toJson(referrerAcquisitionData) shouldEqual referrerAcquisitionPJson
    }

    "be able to be decoded from JSON using Play" in {

      referrerAcquisitionPJson.validate[ReferrerAcquisitionData].asEither.right.value shouldEqual referrerAcquisitionData
    }
  }
}
