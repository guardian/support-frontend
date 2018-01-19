package models

import codecs.CirceDecoders.deriveCodec
import codecs.Codec

case class DirectDebitData(accountNumber: String, sortCodeValue: String, accountHolderName: String) {
  val sortCode = sortCodeValue.filter(_.isDigit)
}

object DirectDebitData {
  implicit val codec: Codec[DirectDebitData] = deriveCodec
}
