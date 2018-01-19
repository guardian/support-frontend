package com.gu.support.workers.encoding

import java.io.{InputStream, OutputStream}
import java.util.Base64

import cats.syntax.either._
import com.gu.support.workers.encoding.Encryption._
import com.gu.support.workers.encoding.Wrapper._
import com.gu.support.workers.model.{ExecutionError, RequestInfo}
import com.gu.zuora.encoding.CustomCodecs.{jsonWrapperDecoder, jsonWrapperEncoder}

import scala.util.Try

object Encoding {

  import io.circe._
  import io.circe.parser._
  import io.circe.syntax._

  def in[T](is: InputStream)(implicit decoder: Decoder[T]): Try[(T, Option[ExecutionError], RequestInfo)] =
    for {
      wrapper <- unWrap(is)
      state <- Try(Base64.getDecoder.decode(wrapper.state))
      decrypted <- Try(decrypt(state, wrapper.requestInfo.encrypted))
      result <- decode[T](decrypted).toTry
    } yield (result, wrapper.error, wrapper.requestInfo)

  def out[T](value: T, requestInfo: RequestInfo, os: OutputStream)(implicit encoder: Encoder[T]): Try[Unit] = {
    val t = Try(os.write(wrap(value, requestInfo).asJson.noSpaces.getBytes()))
    os.close()
    t
  }
}