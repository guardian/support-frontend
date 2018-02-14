package model

import enumeratum.Enum
import enumeratum.EnumEntry
import enumeratum.EnumEntry.Lowercase

import scala.collection.immutable.IndexedSeq

// TODO: should this be RequestMode?
sealed trait RequestType extends EnumEntry with Lowercase

object RequestType extends Enum[RequestType] {

  override val values: IndexedSeq[RequestType] = findValues

  case object Test extends RequestType

  case object Live extends RequestType
}
