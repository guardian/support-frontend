package com.gu.support.workers

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._
import play.api.libs.json.{Reads, Writes}

case class AbTest(
  name: String,
  variant: String
)

case class QueryParameter(
  name: String,
  value: String
)

/**
 * Model for acquisition data passed by the referrer.
 */
case class ReferrerAcquisitionData(
  campaignCode: Option[String],
  referrerPageviewId: Option[String],
  referrerUrl: Option[String],
  componentId: Option[String],
  componentType: Option[String],
  source: Option[String],
  abTests: Option[Set[AbTest]], // TODO - still works?
  queryParameters: Option[Set[QueryParameter]], // TODO - still works?
  hostname: Option[String],
  gaClientId: Option[String],
  userAgent: Option[String],
  ipAddress: Option[String],
  labels: Option[Set[String]]
)

object ReferrerAcquisitionData {
  implicit val queryParameterDecoder = deriveDecoder[QueryParameter]
  implicit val queryParameterEncoder = deriveEncoder[QueryParameter]
  implicit val abTestDecoder = deriveDecoder[AbTest]
  implicit val abTestEncoder = deriveEncoder[AbTest]

  implicit val referrerAcquisitionDataDecoder: Decoder[ReferrerAcquisitionData] = deriveDecoder[ReferrerAcquisitionData]

  implicit val referrerAcquisitionDataEncoder: Encoder[ReferrerAcquisitionData] = deriveEncoder[ReferrerAcquisitionData]

//  implicit val referrerAcquisitionDataReads: Reads[ReferrerAcquisitionData] = PlayJson.reads[ReferrerAcquisitionData]
//
//  implicit val referrerAcquisitionDataWrites: Writes[ReferrerAcquisitionData] = PlayJson.writes[ReferrerAcquisitionData]
}

case class OphanIds(pageviewId: Option[String], visitId: Option[String], browserId: Option[String])

object OphanIds {
  import io.circe._
  import io.circe.generic.semiauto._

  implicit val decoder: Decoder[OphanIds] = deriveDecoder[OphanIds]

  implicit val encoder: Encoder[OphanIds] = deriveEncoder[OphanIds]

//  implicit val reads: Reads[OphanIds] = PlayJson.reads[OphanIds]
//
//  implicit val writes: Writes[OphanIds] = PlayJson.writes[OphanIds]
}

// TODO - this is only used by support-workers
case class AcquisitionData(
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: Set[AbTest]
)

object AcquisitionData {
  implicit val acquisitionDataCodec: Codec[AcquisitionData] = {
    import ReferrerAcquisitionData._
    import OphanIds._
    deriveCodec
  }
}
