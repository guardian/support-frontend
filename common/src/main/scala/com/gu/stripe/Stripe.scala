package com.gu.stripe

import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.encoding.Codec
import io.circe.{Decoder, Encoder}
object Stripe {

  sealed trait StripeObject

  object Error {
    implicit val codec: Codec[Error] = deriveCodec
  }
  case class Error(`type`: String, message: String, code: String = "", decline_code: String = "") extends Throwable with StripeObject {
    override def getMessage: String = s"message: $message; type: ${`type`}; code: $code; decline_code: $decline_code"
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

