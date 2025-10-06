package com.gu.support.encoding

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{ACursor, Decoder, Json}

case class ErrorJson(errorMessage: String, errorType: String, stackTrace: List[String], cause: Option[ErrorJson])

object ErrorJson {
  implicit val decoder: Decoder[ErrorJson] = deriveDecoder[ErrorJson].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject { jsonObject =>
      jsonObject
        .renameField("trace", "stackTrace")
    }
  }
}
