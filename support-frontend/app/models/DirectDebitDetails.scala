package models

import com.gu.support.encoding.Codec._
import com.gu.support.encoding.Codec
import io.circe.{Decoder, Encoder}

case class AccountNumber(private val underlying: String) {
  def value: String = underlying
}

object AccountNumber {
  def fromString(s: String): Option[AccountNumber] = {
    if (s.length == 8 && s.forall(_.isDigit)) Some(AccountNumber(s)) else None
  }

  implicit val decodeAccountNumber: Decoder[AccountNumber] =
    Decoder.decodeString.emap(accountNumber =>
      fromString(accountNumber).toRight(s"Invalid account number '$accountNumber'"),
    )
  implicit val encodeAccountNumber: Encoder[AccountNumber] = Encoder.encodeString.contramap[AccountNumber](_.value)
}

case class SortCode(private val underlying: String) {
  def value: String = underlying
}

object SortCode {
  def fromString(s: String): Option[SortCode] = {
    if (s.length == 6 && s.forall(_.isDigit)) Some(SortCode(s)) else None
  }

  implicit val decodeSortCode: Decoder[SortCode] =
    Decoder.decodeString.emap(sortCode => fromString(sortCode).toRight(s"Invalid sort code '$sortCode'"))
  implicit val encodeSortCode: Encoder[SortCode] = Encoder.encodeString.contramap[SortCode](_.value)
}

case class CheckBankAccountDetails(accountNumber: AccountNumber, sortCode: SortCode)

object CheckBankAccountDetails {
  implicit val codec: Codec[CheckBankAccountDetails] = deriveCodec
}
