package model

import enumeratum.{Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

sealed trait PaymentProvider extends EnumEntry

object PaymentProvider extends Enum[PaymentProvider] {

  override val values: IndexedSeq[PaymentProvider] = findValues

  case object Paypal extends PaymentProvider

  case object Stripe extends PaymentProvider
}
