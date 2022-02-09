package com.gu.stripe

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.PaymentMethodId

import scala.concurrent.Future

object createCustomerFromPaymentMethod {

  object Customer {
    implicit val codec: Codec[Customer] = deriveCodec
  }

  case class Customer(id: String)

  def apply(stripeService: StripeServiceForCurrency)(paymentMethod: PaymentMethodId): Future[Customer] =
    stripeService.postForm[Customer](
      "customers",
      Map(
        "payment_method" -> Seq(paymentMethod.value),
      ),
    )

}
