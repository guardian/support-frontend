package com.gu.support.workers

import java.io.{ByteArrayInputStream, ByteArrayOutputStream}

import cats.syntax.either._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.io.Source
import scala.util.Try

object Conversions {

  implicit class InputStreamConversions[T](val self: T) {

    def asInputStream()(implicit encoder: Encoder[T]): ByteArrayInputStream = {
      val convertStream = new ByteArrayOutputStream()
      convertStream.write(self.asJson.noSpaces.getBytes("UTF-8"))
      new ByteArrayInputStream(convertStream.toByteArray)
    }
  }

  implicit class FromOutputStream(val self: ByteArrayOutputStream) {
    def toClass[T]()(implicit decoder: Decoder[T]): T = {
      val is = new ByteArrayInputStream(self.toByteArray)
      val str = Source.fromInputStream(is).mkString
      val t = Try(str).flatMap(decode[T](_).toTry)
      is.close()
      t.get
    }
  }

  implicit class StringInputStreamConversions[String](val str: String) {

    def asInputStream()(implicit encoder: Encoder[String]): ByteArrayInputStream = {
      val convertStream = new ByteArrayOutputStream()

      convertStream.write(str.toString.getBytes("UTF-8"))
      new ByteArrayInputStream(convertStream.toByteArray)
    }
  }

}
