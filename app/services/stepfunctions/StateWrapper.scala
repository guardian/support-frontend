package services.stepfunctions

import java.util.Base64

import com.gu.support.workers.model.{ExecutionError, JsonWrapper}
import cats.syntax.either._
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import io.circe.syntax._

import scala.util.Try

class StateWrapper(encryption: EncryptionProvider) {
  implicit private val executionErrorEncoder = deriveEncoder[ExecutionError]
  implicit private val executionErrorDecoder = deriveDecoder[ExecutionError]

  implicit private val wrapperEncoder = deriveEncoder[JsonWrapper]
  implicit private val wrapperDecoder = deriveDecoder[JsonWrapper]

  def wrap[T](state: T)(implicit encoder: Encoder[T]): String = {
    JsonWrapper(encodeState(state), None).asJson.noSpaces
  }

  def unWrap[T](s: String)(implicit decoder: Decoder[T]): Try[T] =
    for {
      unwrapped <- decode[JsonWrapper](s)(wrapperDecoder).toTry
      decoded <- decodeState(unwrapped.state)(decoder)
    } yield decoded

  private def encodeState[T](state: T)(implicit encoder: Encoder[T]): String = encodeToBase64String(encryption.encrypt(state.asJson.noSpaces))

  private def decodeState[T](state: String)(implicit decoder: Decoder[T]): Try[T] = for {
    state <- Try(Base64.getDecoder.decode(state))
    decrypted <- Try(encryption.decrypt(state))
    result <- decode[T](decrypted).toTry
  } yield result

  private def encodeToBase64String(value: Array[Byte]): String = new String(Base64.getEncoder.encode(value))
}
