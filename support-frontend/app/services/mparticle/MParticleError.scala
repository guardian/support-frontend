package services.mparticle

import io.circe.Decoder

case class MParticleError() extends Throwable("MParticleError is just a placeholder class")
object MParticleError {
  // Decoding fails because we want to fall back on the generic WebServiceClientError
  implicit val mparticleErrorDecoder: Decoder[MParticleError] =
    Decoder.failedWithMessage("Decoding MParticleError is not supported")
}
