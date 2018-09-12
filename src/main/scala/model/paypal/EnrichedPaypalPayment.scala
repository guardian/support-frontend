package model.paypal

import com.paypal.api.payments.Payment

import scala.util.Try

case class EnrichedPaypalPayment(payment: Payment, email: Option[String])

object EnrichedPaypalPayment {
  def create(payment: Payment, signedInUserEmail: Option[String]): EnrichedPaypalPayment = {
    EnrichedPaypalPayment(
      payment,
      signedInUserEmail.orElse(Try(payment.getPayer.getPayerInfo.getEmail).toOption.filterNot(_.isEmpty))
    )
  }

}
