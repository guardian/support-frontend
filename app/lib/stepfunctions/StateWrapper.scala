package lib.stepfunctions

import java.util.Base64

import com.gu.support.workers.model.JsonWrapper
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._

class StateWrapper(encryption: EncryptionProvider) {
  implicit val wrapperEncoder = deriveEncoder[JsonWrapper]

  def wrap[T](state: T)(implicit encoder: Encoder[T]): String = {
    JsonWrapper(encodeState(state)).asJson.noSpaces
  }

  private def encodeState[T](state: T): String = encodeToBase64String(encryption.encrypt(state.asJson.noSpaces))

  private def encodeToBase64String(value: Array[Byte]): String = new String(Base64.getEncoder.encode(value))
}
