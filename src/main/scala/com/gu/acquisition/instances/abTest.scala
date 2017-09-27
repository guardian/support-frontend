package com.gu.acquisition.instances

import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.{Decoder, Encoder}
import ophan.thrift.event.AbTest

trait AbTestInstances {
  // Ignore IntelliJ - these imports are used!
  import cats.syntax.either._

  implicit val abTestDecoder: Decoder[AbTest] = decodeThriftStruct[AbTest]

  implicit val abTestEncoder: Encoder[AbTest] = encodeThriftStruct[AbTest]
}
