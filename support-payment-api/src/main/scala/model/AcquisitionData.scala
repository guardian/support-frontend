package model

import com.gu.support.acquisitions.{AbTest, QueryParameter}

//-- common for stripe and paypal
case class AcquisitionData(
    platform: Option[String],
    visitId: Option[String],
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
)
