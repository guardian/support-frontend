package model

import enumeratum.{CirceEnum, Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

// Models currencies supported by the API
sealed trait Currency extends EnumEntry

object Currency extends Enum[Currency] with CirceEnum[Currency] {

  override val values: IndexedSeq[Currency] = findValues

  case object GBP extends Currency

  case object USD extends Currency

  case object AUD extends Currency

  case object CAD extends Currency

  case object EUR extends Currency

  case object NZD extends Currency

  def exceedsMaxAmount(amount: Int, currency: Currency): Boolean = {
    val maxAmount = if (currency.equals(AUD)) 16000 else 2000
    if (amount <= maxAmount) false else true
  }
}