package model

import enumeratum.{Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

sealed abstract class PaymentProvider(val name: String) extends EnumEntry

object PaymentProvider extends Enum[PaymentProvider] {

  override val values: IndexedSeq[PaymentProvider] = findValues
  case object Paypal extends PaymentProvider("paypal")
  case object Stripe extends PaymentProvider("card")
}
