package controllers

import akka.util.ByteString
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import play.api.http.{MimeTypes, Writeable}
import play.api.libs.circe.Circe
import play.api.mvc.{Result, Results}
import model.{AcquisitionData, ResultBody}

object JsonReadableOps {
  import com.gu.support.acquisitions.ReferrerAcquisitionData._

  implicit val acquisitionPaypalDataDecoder: Decoder[AcquisitionData] =
    deriveDecoder[AcquisitionData]
}

object JsonWriteableOps {
  implicit class JsonOps[A](val data: A) extends AnyVal {
    def asByteString(implicit encoder: Encoder[A]): ByteString =
      ByteString.fromArray(data.asJson.noSpaces.getBytes)
  }
}

trait JsonUtils { self: Circe with StrictLogging =>

  import JsonWriteableOps._

  protected implicit def jsonWriteable[A : Encoder]: Writeable[A] =
    Writeable(_.asByteString, Some(MimeTypes.JSON))

  override protected def onCirceError(err: io.circe.Error): Result = {
    logger.error("unable to decode JSON", err)
    Results.BadRequest(ResultBody.Error(err.getMessage))
  }

}
