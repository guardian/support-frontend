package com.gu.helpers

import com.gu.support.acquisitions.AbTest

object SupportWorkersV2Helper {
  def isV2SupporterPlus(abTests: Option[Set[AbTest]]) =
    abTests.flatMap(_.find(test => test.name == "supporterPlusV2" && test.variant == "variant")).isDefined
}
