package com.gu.acquisition
package instances

import io.circe.Encoder
import ophan.thrift.event.AbTestInfo

trait AbTestInfoInstances {

  implicit val abTestInfoEncoder: Encoder[AbTestInfo] = Encoder.instance { testInfo =>
    import io.circe.syntax._
    testInfo.tests.map(t => t.name -> Map("variantName" -> t.variant)).toMap.asJson
  }
}
