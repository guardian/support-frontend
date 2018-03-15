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
}
