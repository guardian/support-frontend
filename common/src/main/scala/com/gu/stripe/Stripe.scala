package com.gu.stripe

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.exceptions.{RetryException, RetryLimited, RetryNone, RetryUnlimited}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}

object Stripe {

  sealed trait StripeObject

  object StripeError {
    private val encoder = deriveEncoder[StripeError].mapJson { json => Json.fromFields(List("error" -> json)) }

    private val decoder = deriveDecoder[StripeError].prepare { _.downField("error") }

    implicit val codec: Codec[StripeError] = new Codec[StripeError](encoder, decoder)
  }

  //See docs here: https://stripe.com/docs/api/curl#errors
  case class StripeError(
      `type`: String, //The type of error: api_connection_error, api_error, authentication_error, card_error, invalid_request_error, or rate_limit_error
      message: String, //A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.
      code: Option[String] = None, //For card errors, a short string from amongst those listed on the right describing the kind of card error that occurred.
      decline_code: Option[String] = None, //For card errors resulting from a bank decline, a short string indicating the bank's reason for the decline.
      param: Option[String] = None //The parameter the error relates to if the error is parameter-specific..
  ) extends Throwable with StripeObject {

    override def getMessage: String =
      s"message: $message; type: ${`type`}; code: ${code.getOrElse("")}; decline_code: ${decline_code.getOrElse("")}; param: ${param.getOrElse("")}"

    def asRetryException: RetryException = `type` match {
      case ("api_connection_error" | "api_error" | "rate_limit_error") => new RetryUnlimited(this.asJson.noSpaces, cause = this)
      case "authentication_error" => new RetryLimited(this.asJson.noSpaces, cause = this)
      case ("card_error" | "invalid_request_error" | "validation_error") => new RetryNone(this.asJson.noSpaces, cause = this)
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
    // Zuora requires 'AmericanExpress' not 'American Express'
    // See CreditCardType at https://www.zuora.com/developer/api-reference/#operation/Object_POSTPaymentMethod
    val zuoraCardType = `type`.replaceAll(" ", "")
  }

  object Customer {
    implicit val codec: Codec[Customer] = deriveCodec
  }

  case class Customer(id: String, cards: StripeList[Card]) extends StripeObject {
    // customers should always have a card
    if (cards.total_count != 1) {
      throw StripeError("internal", s"Customer $id has ${cards.total_count} cards, should have exactly one")
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

