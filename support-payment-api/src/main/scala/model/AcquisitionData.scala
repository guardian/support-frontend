package model

import com.gu.support.acquisitions.{AbTest, QueryParameter}
import com.gu.support.encoding.Codec

//-- common for stripe, paypal, and amazon pay
case class AcquisitionData(
    platform: Option[String],
    browserId: Option[String],
    pageviewId: Option[String],
    referrerPageviewId: Option[String],
    referrerUrl: Option[String],
    componentId: Option[String],
    campaignCodes: Option[Set[String]],
    componentType: Option[String],
    source: Option[String],
    abTests: Option[Set[AbTest]],
    queryParameters: Option[Set[QueryParameter]],
    gaId: Option[String],
    labels: Option[Set[String]],
    postalCode: Option[String],
)

object AcquisitionData {
  implicit val codec: Codec[AcquisitionData] = Codec.deriveCodec[AcquisitionData]
}
