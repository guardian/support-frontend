package model

import enumeratum.{CirceEnum, Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

case class Range(min: BigDecimal, max: BigDecimal) {
  def contains(amount: BigDecimal): Boolean = (amount >= min) && (amount <= max)
}

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

  def isAmountOutOfBounds(amount: BigDecimal, currency: Currency): Boolean = {
    // Users can opt in to add 4% to cover the transaction cost
    val transactionCostAsPercentage = 1.04

    val currencyRange = currency match {
      case AUD => Range(min = 1, max = 16000 * transactionCostAsPercentage)
      case USD => Range(min = 1, max = 10000 * transactionCostAsPercentage)
      case _ => Range(min = 1, max = 2000 * transactionCostAsPercentage)
    }

    !currencyRange.contains(amount)
  }
}
