package com.gu.acquisition
package instances

import io.circe.Encoder
import ophan.thrift.event.AbTestInfo

trait AbTestInfoInstances {

  implicit val abTestInfoEncoder: Encoder[AbTestInfo] = Encoder.instance { testInfo =>
    import io.circe.syntax._
    testInfo.tests.map(test => Map("name" -> test.name, "variant" -> test.variant)).asJson
  }
}
