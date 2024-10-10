package services.stepfunctions

import com.gu.support.workers.{ExecutionError, JsonWrapper, RequestInfo}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.util.Try
import java.nio.charset.Charset

class StateWrapper() {
  implicit private val executionErrorEncoder: Encoder.AsObject[ExecutionError] = deriveEncoder[ExecutionError]
  implicit private val executionErrorDecoder: Decoder[ExecutionError] = deriveDecoder[ExecutionError]

  implicit private val requestInfoEncoder: Encoder.AsObject[RequestInfo] = deriveEncoder[RequestInfo]
  implicit private val requestInfoDecoder: Decoder[RequestInfo] = deriveDecoder[RequestInfo]

  implicit private val wrapperEncoder: Encoder.AsObject[JsonWrapper] = deriveEncoder[JsonWrapper]
  implicit private val wrapperDecoder: Decoder[JsonWrapper] = deriveDecoder[JsonWrapper]

  val utf8: Charset = java.nio.charset.StandardCharsets.UTF_8

  def wrap[T](state: T, isTestUser: Boolean, isExistingAccount: Boolean)(implicit encoder: Encoder[T]): String = {
    JsonWrapper(state.asJson, None, RequestInfo(isTestUser, failed = false, Nil, isExistingAccount)).asJson.noSpaces
  }

  def unWrap[T](s: String)(implicit decoder: Decoder[T]): Try[T] =
    for {
      wrapper <- decode[JsonWrapper](s)(wrapperDecoder).toTry
      decoded <- wrapper.state.as[T].toTry
    } yield decoded
}
