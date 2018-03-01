package model.paypal

import enumeratum.{Enum, EnumEntry}
import enumeratum.EnumEntry.Lowercase
import model.Environment

import scala.collection.immutable.IndexedSeq

sealed trait PaypalMode extends EnumEntry with Lowercase

object PaypalMode extends Enum[PaypalMode] {

  override val values: IndexedSeq[PaypalMode] = findValues

  def fromEnvironment(environment: Environment): PaypalMode = {
    environment match {
      case Environment.Live => PaypalMode.Live
      case _ => PaypalMode.Sandbox
    }
  }

  case object Sandbox extends PaypalMode

  case object Live extends PaypalMode

}
