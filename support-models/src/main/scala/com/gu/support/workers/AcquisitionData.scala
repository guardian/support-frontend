package com.gu.support.workers

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import ophan.thrift.event.AbTest

case class AcquisitionData(
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: Set[AbTest]
)

object AcquisitionData {
  implicit val acquisitionDataCodec: Codec[AcquisitionData] = {
    import com.gu.acquisition.instances.abTest._
    deriveCodec
  }
}
