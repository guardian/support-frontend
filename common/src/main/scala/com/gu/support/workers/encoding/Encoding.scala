package com.gu.support.workers.encoding

import java.io.{InputStream, OutputStream}

import cats.syntax.either._
import com.gu.support.workers.encoding.Encryption._

import scala.util.Try

private[workers] object Encoding {

  import io.circe._
  import io.circe.parser._
  import io.circe.syntax._

  def in[T](is: InputStream)(implicit decoder: Decoder[T]): Try[T] = {
    val t = Try(decrypt(is)).flatMap(decode[T](_).toTry)
    is.close()
    t
  }

  def out[T](value: T, os: OutputStream)(implicit encoder: Encoder[T]): Try[Unit] = {
    val t = Try(os.write(encrypt(value.asJson.noSpaces)))
    os.close()
    t
  }
}