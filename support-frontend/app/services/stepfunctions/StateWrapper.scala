package services.stepfunctions

import java.util.Base64

import com.gu.support.workers.{ExecutionError, JsonWrapper, RequestInfo}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.util.Try

class StateWrapper() {
  implicit private val executionErrorEncoder = deriveEncoder[ExecutionError]
  implicit private val executionErrorDecoder = deriveDecoder[ExecutionError]

  implicit private val requestInfoEncoder = deriveEncoder[RequestInfo]
  implicit private val requestInfoDecoder = deriveDecoder[RequestInfo]

  implicit private val wrapperEncoder = deriveEncoder[JsonWrapper]
  implicit private val wrapperDecoder = deriveDecoder[JsonWrapper]

  val utf8 = "UTF-8"

  def wrap[T](state: T, isTestUser: Boolean, isExistingAccount: Boolean)(implicit encoder: Encoder[T]): String = {
    JsonWrapper(encodeState(state), None, RequestInfo(isTestUser, failed = false, Nil, isExistingAccount)).asJson.noSpaces
  }

  def unWrap[T](s: String)(implicit decoder: Decoder[T]): Try[T] =
    for {
      unwrapped <- decode[JsonWrapper](s)(wrapperDecoder).toTry
      decoded <- decodeState(unwrapped.state)(decoder)
    } yield decoded

  private def encodeState[T](state: T)(implicit encoder: Encoder[T]): String = encodeToBase64String(state.asJson.noSpaces.getBytes(utf8))

  private def decodeState[T](state: String)(implicit decoder: Decoder[T]): Try[T] = for {
    state <- Try(Base64.getDecoder.decode(state))
    decrypted <- Try(new String(state, utf8))
    result <- decode[T](decrypted).toTry
  } yield result

  private def encodeToBase64String(value: Array[Byte]): String = new String(Base64.getEncoder.encode(value))
}
