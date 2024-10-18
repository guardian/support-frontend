package com.gu.support.workers.encoding

import java.io.{InputStream, OutputStream}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.encoding.Wrapper._
import com.gu.support.workers.lambdas.HandlerResult
import com.gu.support.workers.{ExecutionError, JsonWrapper, RequestInfo}

import scala.util.Try

object Encoding {

  import io.circe._
  import io.circe.parser._
  import io.circe.syntax._

  def in[T](is: InputStream)(implicit decoder: Decoder[T]): Try[(T, Option[ExecutionError], RequestInfo)] =
    for {
      wrapper <- unWrap(is)
      result <- wrapper.state.as[T].toTry
    } yield (result, wrapper.error, wrapper.requestInfo)

  def out[T](handlerResult: HandlerResult[T], os: OutputStream)(implicit encoder: Encoder[T]): Try[Unit] = {
    val t = Try(os.write(wrap(handlerResult).asJson.noSpaces.getBytes()))
    os.close()
    t
  }
}
