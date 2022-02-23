package com.gu.support.acquisitions

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class AbTest(
    name: String,
    variant: String,
)

case class QueryParameter(
    name: String,
    value: String,
)

/** Model for acquisition data passed by the referrer.
  */
case class ReferrerAcquisitionData(
    campaignCode: Option[String] = None,
    referrerPageviewId: Option[String] = None,
    referrerUrl: Option[String] = None,
    componentId: Option[String] = None,
    componentType: Option[String] = None,
    source: Option[String] = None,
    abTests: Option[Set[AbTest]] = None,
    queryParameters: Option[Set[QueryParameter]] = None,
    hostname: Option[String] = None,
    gaClientId: Option[String] = None,
    userAgent: Option[String] = None,
    ipAddress: Option[String] = None,
    labels: Option[Set[String]] = None,
)

object ReferrerAcquisitionData {
  implicit val queryParameterDecoder = deriveDecoder[QueryParameter]
  implicit val queryParameterEncoder = deriveEncoder[QueryParameter]
  implicit val abTestDecoder = deriveDecoder[AbTest]
  implicit val abTestEncoder = deriveEncoder[AbTest]

  implicit val referrerAcquisitionDataDecoder: Decoder[ReferrerAcquisitionData] = deriveDecoder[ReferrerAcquisitionData]

  implicit val referrerAcquisitionDataEncoder: Encoder[ReferrerAcquisitionData] = deriveEncoder[ReferrerAcquisitionData]
}

case class OphanIds(pageviewId: Option[String], visitId: Option[String], browserId: Option[String])

object OphanIds {
  import io.circe._
  import io.circe.generic.semiauto._

  implicit val decoder: Decoder[OphanIds] = deriveDecoder[OphanIds]

  implicit val encoder: Encoder[OphanIds] = deriveEncoder[OphanIds]
}

case class AcquisitionData(
    ophanIds: OphanIds,
    referrerAcquisitionData: ReferrerAcquisitionData,
    supportAbTests: Set[AbTest],
)

object AcquisitionData {
  implicit val acquisitionDataCodec: Codec[AcquisitionData] = {
    import ReferrerAcquisitionData._
    deriveCodec
  }
}
