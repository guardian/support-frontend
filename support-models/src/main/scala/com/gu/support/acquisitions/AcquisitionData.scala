package com.gu.support.acquisitions

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class AbTest(
    name: String,
    variant: String,
)

object AbTest {
  implicit val codec: Codec[AbTest] = deriveCodec
}

case class QueryParameter(
    name: String,
    value: String,
)

object QueryParameter {
  implicit val codec: Codec[QueryParameter] = deriveCodec
}

/** Model for acquisition data passed by the referrer.
  */
case class ReferrerAcquisitionData(
    campaignCode: Option[String],
    referrerPageviewId: Option[String],
    referrerUrl: Option[String],
    componentId: Option[String],
    componentType: Option[String],
    source: Option[String],
    abTests: Option[Set[AbTest]],
    queryParameters: Option[Set[QueryParameter]],
    hostname: Option[String],
    gaClientId: Option[String],
    userAgent: Option[String],
    ipAddress: Option[String],
    labels: Option[Set[String]],
)

object ReferrerAcquisitionData {

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
