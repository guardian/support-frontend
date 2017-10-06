package codecs

import com.gu.fezziwig.CirceScroogeMacros.{decodeThriftStruct, encodeThriftStruct}
import io.circe.{Decoder, Encoder}
import ophan.thrift.event.{AbTest, AcquisitionSource}
import com.gu.fezziwig.CirceScroogeMacros._
import cats.syntax.either._
import codecs.CirceDecoders.deriveCodec
import com.gu.acquisition.model.ReferrerAcquisitionData
import ophan.thrift.componentEvent.ComponentType

object CirceThriftDecoders {

  implicit val supportAbTestsDecoder: Decoder[AbTest] = decodeThriftStruct[AbTest]
  implicit val supportAbTestsEncoder: Encoder[AbTest] = encodeThriftStruct[AbTest]

  implicit val componentTypeDecoder: Decoder[ComponentType] = decodeThriftEnum[ComponentType]
  implicit val componentTypeEncoder: Encoder[ComponentType] = encodeThriftEnum[ComponentType]

  implicit val acquisitionSourceDecoder: Decoder[AcquisitionSource] = decodeThriftEnum[AcquisitionSource]
  implicit val acquisitionSourceEncoder: Encoder[AcquisitionSource] = encodeThriftEnum[AcquisitionSource]

  implicit val referrerAcquisitionDataCodec: Codec[ReferrerAcquisitionData] = deriveCodec

}
