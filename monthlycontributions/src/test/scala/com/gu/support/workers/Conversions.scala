package com.gu.support.workers

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, OutputStream}

import io.circe.{Decoder, Encoder}
import io.circe.parser._
import io.circe.syntax._
import cats.syntax.either._

import scala.io.Source
import scala.util.Try

object Conversions {

  implicit class InputStreamConversions[T](val self: T) {

    def asInputStream()(implicit encoder: Encoder[T]) = {
      val convertStream = new ByteArrayOutputStream()
      convertStream.write(self.asJson.noSpaces.getBytes("UTF-8"))
      new ByteArrayInputStream(convertStream.toByteArray)
    }
  }

  implicit class FromOutputStream(val self: ByteArrayOutputStream) {
    def toClass[T]()(implicit decoder: Decoder[T]): T = {
      val is = new ByteArrayInputStream(self.toByteArray)
      val t = Try(Source.fromInputStream(is).mkString).flatMap(decode[T](_).toTry)
      is.close()
      t.get
    }
  }

}
