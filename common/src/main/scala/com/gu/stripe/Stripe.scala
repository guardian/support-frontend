package com.gu.stripe

object Stripe {

  sealed trait StripeObject

  case class Error(`type`: String, message: String, code: String = "", decline_code: String = "") extends Throwable with StripeObject {
    override def getMessage: String = s"message: $message; type: ${`type`}; code: $code; decline_code: $decline_code"
  }

  case class StripeList[T](total_count: Int, data: Seq[T]) extends StripeObject

  case class Card(id: String, `type`: String, last4: String, exp_month: Int, exp_year: Int, country: String) extends StripeObject {
    val issuer = `type`.toLowerCase
  }

  case class Customer(id: String, cards: StripeList[Card]) extends StripeObject {
    // customers should always have a card
    if (cards.total_count != 1) {
      throw Error("internal", s"Customer $id has ${cards.total_count} cards, should have exactly one")
    }

    val card = cards.data.head
  }

  case class Charge(id: String, amount: Int, balance_transaction: Option[String], created: Int, currency: String, livemode: Boolean,
      paid: Boolean, refunded: Boolean, receipt_email: String, metadata: Map[String, String], source: Source) extends StripeObject {
  }

  case class Source(country: String) extends StripeObject

  case class BalanceTransaction(id: String, source: String, amount: Int) extends StripeObject

}

