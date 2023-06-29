package com.gu.patrons.conf

import com.gu.patrons.services.{ConfigService, ParameterStoreService}
import com.gu.supporterdata.model.Stage

case class PatronsStripeConfig(
    apiKey: String,
    apiKeyAu: String,
    cancelledHookSigningSecret: String,
    cancelledHookSigningSecretAu: String,
    signUpHookSigningSecret: String,
    signUpHookSigningSecretAustralia: String,
)

object PatronsStripeConfig extends ConfigService {
  private val stripeConfigPath = "stripe-config"

  def fromParameterStoreSync(stage: Stage): PatronsStripeConfig = {
    val params = ParameterStoreService(stage).getParametersByPathSync(stripeConfigPath)
    PatronsStripeConfig(
      findParameterOrThrow("api-key", params),
      findParameterOrThrow("api-key-au", params),
      findParameterOrThrow("cancelled-hook-signing-secret", params),
      findParameterOrThrow("cancelled-hook-signing-secret-au", params),
      findParameterOrThrow("sign-up-hook-signing-secret", params),
      findParameterOrThrow("sign-up-hook-signing-secret-au", params),
    )
  }
}
