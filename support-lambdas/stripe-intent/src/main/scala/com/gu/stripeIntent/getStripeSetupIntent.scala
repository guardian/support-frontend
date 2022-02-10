package com.gu.stripeIntent

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.PaymentMethodId

import scala.concurrent.Future

object getStripeSetupIntent {

  object SetupIntent {
    implicit val codec: Codec[SetupIntent] = deriveCodec
  }

  case class SetupIntent(id: String, client_secret: String)

  def apply(stripeService: StripeService)(): Future[SetupIntent] =
    stripeService.postForm[SetupIntent](
      "setup_intents",
      Map(
        "usage" -> Seq("off_session"),
      ),
    )

}
