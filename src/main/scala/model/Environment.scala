package model

import enumeratum.Enum
import enumeratum.EnumEntry
import enumeratum.EnumEntry.Lowercase

import scala.collection.immutable.IndexedSeq

// Represents the environment against which to execute requests.
// This will determine e.g. the Stripe and Paypal services to use.
// LowerCase ensures entry names will be lower case
sealed trait Environment extends EnumEntry with Lowercase

object Environment extends Enum[Environment] {

  override val values: IndexedSeq[Environment] = findValues

  case object Test extends Environment

  case object Live extends Environment
}
