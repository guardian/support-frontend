package com.gu.support.workers.encoding

import java.io.InputStream

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonWrapper
import com.gu.support.workers.lambdas.HandlerResult
import io.circe.Encoder
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._

import scala.io.Source
import scala.util.Try

object Wrapper {
  def unWrap(is: InputStream): Try[JsonWrapper] = {
    val t = Try(Source.fromInputStream(is).mkString).flatMap(decode[JsonWrapper](_).toTry)
    is.close()
    t
  }

  def wrap[T](handlerResult: HandlerResult[T])(implicit encoder: Encoder[T]): JsonWrapper =
    JsonWrapper(handlerResult.value.asJson.noSpaces, None, handlerResult.requestInfo)

}
