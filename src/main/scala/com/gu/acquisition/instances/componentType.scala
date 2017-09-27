package com.gu.acquisition.instances

import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.{Decoder, Encoder}
import ophan.thrift.componentEvent.ComponentType

trait ComponentTypeInstances {

  implicit val componentTypeDecoder: Decoder[ComponentType] = decodeThriftEnum[ComponentType]

  implicit val componentTypeEncoder: Encoder[ComponentType] = encodeThriftEnum[ComponentType]
}
