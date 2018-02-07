package model

import enumeratum.Enum
import enumeratum.EnumEntry
import enumeratum.EnumEntry.Lowercase

import scala.collection.immutable.IndexedSeq

sealed trait AppMode extends EnumEntry with Lowercase

object AppMode extends Enum[AppMode] {

  override val values: IndexedSeq[AppMode] = findValues

  case object Test extends AppMode

  case object Live extends AppMode
}

sealed trait RequestType extends EnumEntry

object RequestType extends Enum[RequestType] with Lowercase {

  override val values: IndexedSeq[RequestType] = findValues

  case object Test extends RequestType

  case object Live extends RequestType
}

// Represents the environment against which to execute requests.
// This will determine e.g. the Stripe and Paypal services to use.
// LowerCase ensures entry names will be lower case
sealed trait Environment extends EnumEntry with Lowercase

object Environment extends Enum[Environment] {

  override val values: IndexedSeq[Environment] = findValues

  case object Test extends Environment

  case object Live extends Environment

  def apply(mode: AppMode, requestType: RequestType): Environment =
    (mode, requestType) match {
      case (AppMode.Live, RequestType.Live) => Live
      case _ => Test
    }
}
