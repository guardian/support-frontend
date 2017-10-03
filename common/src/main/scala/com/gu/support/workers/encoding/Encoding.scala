package com.gu.support.workers.encoding

import java.io.{InputStream, OutputStream}
import java.util.Base64

import cats.syntax.either._
import com.gu.support.workers.encoding.Encryption._
import com.gu.support.workers.encoding.Wrapper._
import com.gu.support.workers.model.ExecutionError
import com.gu.zuora.encoding.CustomCodecs.{jsonWrapperDecoder, jsonWrapperEncoder}

import scala.util.Try

private[workers] object Encoding {

  import io.circe._
  import io.circe.parser._
  import io.circe.syntax._

  def in[T](is: InputStream)(implicit decoder: Decoder[T]): Try[(T, Boolean, Option[ExecutionError])] =
    for {
      wrapper <- unWrap(is)
      state <- Try(Base64.getDecoder.decode(wrapper.state))
      decrypted <- Try(decrypt(state, wrapper.encrypted))
      result <- decode[T](decrypted).toTry
    } yield (result, wrapper.encrypted, wrapper.error)

  def out[T](value: T, encrypted: Boolean, os: OutputStream)(implicit encoder: Encoder[T]): Try[Unit] = {
    val t = Try(os.write(wrap(value, encrypted).asJson.noSpaces.getBytes()))
    os.close()
    t
  }
}