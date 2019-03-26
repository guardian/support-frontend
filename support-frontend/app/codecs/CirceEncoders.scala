package codecs

import com.gu.identity.play._
import com.gu.support.encoding.{HelperCodecs, InternationalisationCodecs}
import io.circe.{Encoder}

object CirceEncoders extends InternationalisationCodecs with HelperCodecs {
  import io.circe.generic.semiauto.deriveEncoder
  implicit val teleEncoder: Encoder[TelephoneNumber] = deriveEncoder[TelephoneNumber]
  implicit val privateFieldsEncoder: Encoder[PrivateFields] = deriveEncoder[PrivateFields]
  implicit val publicFieldsEncoder: Encoder[PublicFields] = deriveEncoder[PublicFields]
  implicit val statusFieldsEncoder: Encoder[StatusFields] = deriveEncoder[StatusFields]
  implicit val encodeIdUser: Encoder[IdUser] = deriveEncoder[IdUser]
}
