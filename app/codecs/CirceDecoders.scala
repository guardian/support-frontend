package codecs

import com.gu.fezziwig.CirceScroogeMacros.{decodeThriftEnum, decodeThriftStruct, encodeThriftEnum, encodeThriftStruct}
import com.gu.support.encoding.{HelperCodecs, InternationalisationCodecs}
import io.circe.{Decoder, Encoder}
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}

object CirceDecoders extends InternationalisationCodecs with HelperCodecs {

  implicit val abTestDecoder: Decoder[AbTest] = decodeThriftStruct[AbTest]
  implicit val abTestEncoder: Encoder[AbTest] = encodeThriftStruct[AbTest]

  implicit val componentTypeDecoder: Decoder[ComponentType] = decodeThriftEnum[ComponentType]
  implicit val componentTypeEncoder: Encoder[ComponentType] = encodeThriftEnum[ComponentType]

  implicit val acquisitionSourceDecoder: Decoder[AcquisitionSource] = decodeThriftEnum[AcquisitionSource]
  implicit val acquisitionSourceEncoder: Encoder[AcquisitionSource] = encodeThriftEnum[AcquisitionSource]
}
