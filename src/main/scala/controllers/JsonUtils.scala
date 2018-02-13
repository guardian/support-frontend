package controllers

import akka.util.ByteString
import io.circe.syntax._
import io.circe.Encoder
import play.api.http.{MimeTypes, Writeable}
import play.api.libs.circe.Circe
import play.api.mvc.{Result, Results}

import model.ResultBody

object JsonWriteableOps {

  implicit class JsonOps[A](val data: A) extends AnyVal {
    def asByteString(implicit encoder: Encoder[A]): ByteString =
      ByteString.fromArray(data.asJson.noSpaces.getBytes)
  }
}

trait JsonUtils { self: Circe =>

  import JsonWriteableOps._

  protected implicit def jsonWriteable[A : Encoder]: Writeable[A] =
    Writeable(_.asByteString, Some(MimeTypes.JSON))

  override protected def onCirceError(e: io.circe.Error): Result = {
    Results.BadRequest(ResultBody.Error(e.getMessage))
  }
}
