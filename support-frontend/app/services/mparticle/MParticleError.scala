package services.mparticle

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class MParticleError(message: String) extends Throwable(message)
object MParticleError {
  implicit val mparticleErrorDecoder: Decoder[MParticleError] = deriveDecoder
}
