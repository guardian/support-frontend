package com.gu.support.workers.encoding

import java.io.{InputStream, OutputStream}
import java.util.Base64

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.encoding.Wrapper._
import com.gu.support.workers.lambdas.HandlerResult
import com.gu.support.workers.{ExecutionError, JsonWrapper, RequestInfo}
import io.circe.generic.auto._

import scala.util.Try

object Encoding {

  import io.circe._
  import io.circe.parser._
  import io.circe.syntax._

  def in[T](is: InputStream)(implicit decoder: Decoder[T]): Try[(T, Option[ExecutionError], RequestInfo)] =
    for {
      wrapper <- unWrap(is)
      state <- Try(base64decode(wrapper))
      result <- decode[T](state).toTry
    } yield (result, wrapper.error, wrapper.requestInfo)

  private def base64decode(wrapper: JsonWrapper) =
    if (wrapper.requestInfo.base64Encoded.getOrElse(true))
      new String(Base64.getDecoder.decode(wrapper.state), utf8)
    else
      wrapper.state

  def out[T](handlerResult: HandlerResult[T], os: OutputStream)(implicit encoder: Encoder[T]): Try[Unit] = {
    val t = Try(os.write(wrap(handlerResult).asJson.noSpaces.getBytes()))
    os.close()
    t
  }
}
