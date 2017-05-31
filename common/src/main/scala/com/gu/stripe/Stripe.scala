package com.gu.stripe

import io.circe.generic.semiauto._
import io.circe.{Decoder, Encoder}
object Stripe {

  sealed trait StripeObject

  object Error {
    implicit val encoder: Encoder[Error] = deriveEncoder
    implicit val decoder: Decoder[Error] = deriveDecoder
  }
  case class Error(`type`: String, message: String, code: String = "", decline_code: String = "") extends Throwable with StripeObject {
    override def getMessage: String = s"message: $message; type: ${`type`}; code: $code; decline_code: $decline_code"
  }

  object StripeList {
    implicit def encoder[T](implicit encoder: Encoder[T]): Encoder[StripeList[T]] = deriveEncoder[StripeList[T]]
    implicit def decoder[T](implicit decoder: Decoder[T]): Decoder[StripeList[T]] = deriveDecoder[StripeList[T]]
  }
  case class StripeList[T](total_count: Int, data: Seq[T]) extends StripeObject

  object Card {
    implicit val encoder: Encoder[Card] = deriveEncoder
    implicit val decoder: Decoder[Card] = deriveDecoder
  }
  case class Card(id: String, `type`: String, last4: String, exp_month: Int, exp_year: Int, country: String) extends StripeObject {
    val issuer = `type`.toLowerCase
  }

  object Customer {
    implicit val encoder: Encoder[Customer] = deriveEncoder
    implicit val decoder: Decoder[Customer] = deriveDecoder
  }
  case class Customer(id: String, cards: StripeList[Card]) extends StripeObject {
    // customers should always have a card
    if (cards.total_count != 1) {
      throw Error("internal", s"Customer $id has ${cards.total_count} cards, should have exactly one")
    }

    val card = cards.data.head
  }

  object Source {
    implicit val encoder = deriveEncoder[Source]
    implicit val decoder = deriveDecoder[Source]
  }
  case class Source(country: String) extends StripeObject

  object Charge {
    implicit val encoder: Encoder[Charge] = deriveEncoder
    implicit val decoder: Decoder[Charge] = deriveDecoder
  }
  case class Charge(id: String, amount: Int, balance_transaction: Option[String], created: Int, currency: String, livemode: Boolean,
      paid: Boolean, refunded: Boolean, receipt_email: String, metadata: Map[String, String], source: Source) extends StripeObject {
  }

  object BalanceTransaction {
    implicit val encoder: Encoder[BalanceTransaction] = deriveEncoder
    implicit val decoder: Decoder[BalanceTransaction] = deriveDecoder
  }
  case class BalanceTransaction(id: String, source: String, amount: Int) extends StripeObject

}

