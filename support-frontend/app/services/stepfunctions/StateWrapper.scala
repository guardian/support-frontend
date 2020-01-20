package services.stepfunctions

import java.util.Base64

import com.gu.support.workers.{ExecutionError, JsonWrapper, RequestInfo}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.util.Try

class StateWrapper() {
  implicit private val executionErrorEncoder: Encoder.AsObject[ExecutionError] = deriveEncoder[ExecutionError]
  implicit private val executionErrorDecoder: Decoder[ExecutionError] = deriveDecoder[ExecutionError]

  implicit private val requestInfoEncoder: Encoder.AsObject[RequestInfo] = deriveEncoder[RequestInfo]
  implicit private val requestInfoDecoder: Decoder[RequestInfo] = deriveDecoder[RequestInfo]

  implicit private val wrapperEncoder: Encoder.AsObject[JsonWrapper] = deriveEncoder[JsonWrapper]
  implicit private val wrapperDecoder: Decoder[JsonWrapper] = deriveDecoder[JsonWrapper]

  val utf8 = java.nio.charset.StandardCharsets.UTF_8

  def wrap[T](state: T, isTestUser: Boolean, isExistingAccount: Boolean)(implicit encoder: Encoder[T]): String = {
    JsonWrapper(encodeState(state), None, RequestInfo(isTestUser, failed = false, Nil, isExistingAccount, Some(false))).asJson.noSpaces
  }

  def unWrap[T](s: String)(implicit decoder: Decoder[T]): Try[T] =
    for {
      unwrapped <- decode[JsonWrapper](s)(wrapperDecoder).toTry
      decoded <- decodeState(unwrapped)(decoder)
    } yield decoded

  private def encodeState[T](state: T)(implicit encoder: Encoder[T]): String = state.asJson.noSpaces

  private def decodeState[T](wrapper: JsonWrapper)(implicit decoder: Decoder[T]): Try[T] = for {
    state <- Try(base64decode(wrapper))
    result <- decode[T](state).toTry
  } yield result

  private def base64decode(wrapper: JsonWrapper) =
    if (wrapper.requestInfo.base64Encoded.getOrElse(true))
      new String(Base64.getDecoder.decode(wrapper.state), utf8)
    else
      wrapper.state

}
