package com.gu.support.workers.model

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import ophan.thrift.event.AbTest

case class AcquisitionData(
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: Set[AbTest]
)
