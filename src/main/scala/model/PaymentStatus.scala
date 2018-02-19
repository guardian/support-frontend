package model

import enumeratum.{Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

sealed trait PaymentStatus extends EnumEntry

object PaymentStatus extends Enum[PaymentProvider] {

  override val values: IndexedSeq[PaymentProvider] = findValues

  case object Paid extends PaymentStatus

  case object Failed extends PaymentStatus

  case object Refunded extends PaymentStatus
}
