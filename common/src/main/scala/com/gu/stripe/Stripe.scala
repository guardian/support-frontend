package com.gu.stripe

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.exceptions.{RetryException, RetryLimited, RetryNone, RetryUnlimited}
import io.circe.{Decoder, Encoder}

object Stripe {

  sealed trait StripeObject

  object Error {
    implicit val codec: Codec[Error] = deriveCodec
  }

  //See docs here: https://stripe.com/docs/api/curl#errors
  case class Error(
    `type`: String, //The type of error: api_connection_error, api_error, authentication_error, card_error, invalid_request_error, or rate_limit_error
    message: String, //A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.
    code: String = "", //For card errors, a short string from amongst those listed on the right describing the kind of card error that occurred.
    decline_code: String = "", //For card errors resulting from a bank decline, a short string indicating the bank's reason for the decline.
    param: String = "" //The parameter the error relates to if the error is parameter-specific..
  ) extends Throwable with StripeObject {

    override def getMessage: String = s"message: $message; type: ${`type`}; code: $code; decline_code: $decline_code; param: $param"

    def asRetryException: RetryException = `type` match {
      case "api_connection_error" | "api_error" | "rate_limit_error" => new RetryUnlimited(cause = this)
      case "authentication_error" => new RetryLimited(cause = this)
      case "card_error" | "invalid_request_error" | "validation_error" => new RetryNone(cause = this)
    }
  }

  object StripeList {
    implicit def codec[T](implicit encoder: Encoder[T], decoder: Decoder[T]): Codec[StripeList[T]] = deriveCodec[StripeList[T]]
  }

  case class StripeList[T](total_count: Int, data: Seq[T]) extends StripeObject

  object Card {
    implicit val codec: Codec[Card] = deriveCodec
  }

  case class Card(id: String, `type`: String, last4: String, exp_month: Int, exp_year: Int, country: String) extends StripeObject {
    val issuer = `type`.toLowerCase
  }

  object Customer {
    implicit val codec: Codec[Customer] = deriveCodec
  }

  case class Customer(id: String, cards: StripeList[Card]) extends StripeObject {
    // customers should always have a card
    if (cards.total_count != 1) {
      throw Error("internal", s"Customer $id has ${cards.total_count} cards, should have exactly one")
    }

    val card = cards.data.head
  }

  object Source {
    implicit val codec: Codec[Source] = deriveCodec
  }

  case class Source(country: String) extends StripeObject

  object Charge {
    implicit val codec: Codec[Charge] = deriveCodec
  }

  case class Charge(id: String, amount: Int, balance_transaction: Option[String], created: Int, currency: String, livemode: Boolean,
    paid: Boolean, refunded: Boolean, receipt_email: String, metadata: Map[String, String], source: Source) extends StripeObject {
  }

  object BalanceTransaction {
    implicit val codec: Codec[BalanceTransaction] = deriveCodec
  }

  case class BalanceTransaction(id: String, source: String, amount: Int) extends StripeObject

}

