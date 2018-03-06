package model

import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}

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
  componentType: Option[ComponentType],
  source: Option[AcquisitionSource],
  abTests: Option[Set[AbTest]]
)
