package com.gu.support.workers.encoding

import java.io.InputStream
import java.util.Base64

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.lambdas.HandlerResult
import com.gu.support.workers.{JsonWrapper, RequestInfo}
import io.circe.Encoder
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._

import scala.io.Source
import scala.util.Try

/**
 * TODO: Remove this
 * AWS Step Functions expect to be passed valid Json, as we want to encrypt the whole of the
 * state, we need to wrap it in a Json 'wrapper' object as a Base64 encoded String.
 * This class helps with that
 */
object Wrapper {
  def unWrap(is: InputStream): Try[JsonWrapper] = {
    val t = Try(Source.fromInputStream(is).mkString).flatMap(decode[JsonWrapper](_).toTry)
    is.close()
    t
  }

  def wrap[T](handlerResult: HandlerResult[T])(implicit encoder: Encoder[T]): JsonWrapper =
    wrapString(handlerResult.value.asJson.noSpaces, handlerResult.requestInfo)

  def wrapString(string: String, requestInfo: RequestInfo): JsonWrapper =
    JsonWrapper(encodeToBase64String(string.getBytes(utf8)), None, requestInfo)

  def encodeToBase64String(value: Array[Byte]): String = new String(Base64.getEncoder.encode(value))
}
