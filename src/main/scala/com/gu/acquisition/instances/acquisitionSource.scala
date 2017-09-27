package com.gu.acquisition.instances

import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.{Decoder, Encoder}
import ophan.thrift.event.AcquisitionSource

trait AcquisitionSourceInstances {

  implicit val acquisitionSourceDecoder: Decoder[AcquisitionSource] = decodeThriftEnum[AcquisitionSource]

  implicit val acquisitionSourceEncoder: Encoder[AcquisitionSource] = encodeThriftEnum[AcquisitionSource]
}
