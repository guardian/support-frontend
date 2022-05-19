package com.gu.patrons.conf

import com.gu.patrons.services.{ConfigService, ParameterStoreService}
import com.gu.supporterdata.model.Stage

import scala.concurrent.{ExecutionContext, Future}

case class StripePatronsConfig(
    apiKey: String,
)

object StripePatronsConfig extends ConfigService {
  private val stripeConfigPath = "stripe-config"
  def fromParameterStore(
      stage: Stage,
  )(implicit ec: ExecutionContext) = {
    ParameterStoreService(stage).getParametersByPath(stripeConfigPath).map { params =>
      StripePatronsConfig(
        findParameterOrThrow("api-key", params),
      )
    }
  }
}
