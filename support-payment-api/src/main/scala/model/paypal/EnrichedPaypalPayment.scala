package model.paypal

import com.paypal.api.payments.Payment

case class EnrichedPaypalPayment(payment: Payment, email: Option[String], userType: Option[String])
