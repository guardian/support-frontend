package com.gu.support.workers.encoding

import cats.syntax.either._
import com.gu.support.workers.model._
import com.gu.zuora.encoding.CustomCodecs.{decodeCountry, decodeCurrency}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.semiauto._
import io.circe.{Decoder, DecodingFailure, HCursor}

object CreatePaymentMethodStateDecoder extends LazyLogging {
  implicit val decodePaymentFields: Decoder[Either[StripePaymentFields, PayPalPaymentFields]] = new Decoder[Either[StripePaymentFields, PayPalPaymentFields]] {
    final def apply(c: HCursor): Decoder.Result[Either[StripePaymentFields, PayPalPaymentFields]] = {
      val payPalBaid = c.value \\ "paypalBaid"
      val userId = c.value \\ "userId"
      val stripeToken = c.value \\ "stripeToken"

      (payPalBaid.headOption, userId.headOption, stripeToken.headOption) match {
        case (Some(baid), None, None) => Right(Right(PayPalPaymentFields(baid.asString.get)))
        case (None, Some(id), Some(token)) => Right(Left(StripePaymentFields(id.asString.get, token.asString.get)))
        case _ => Left(DecodingFailure(s"Invalid input:\n${c.value}", c.history))
      }
    }
  }

  implicit val decodeCreatePaymentMethodState: Decoder[CreatePaymentMethodState] = new Decoder[CreatePaymentMethodState] {
    final def apply(c: HCursor): Decoder.Result[CreatePaymentMethodState] = {
      implicit val userDecoder: Decoder[User] = deriveDecoder
      implicit val contributionDecoder: Decoder[Contribution] = deriveDecoder

      val state = for {
        userJson <- c.value \\ "user"
        contributionJson <- c.value \\ "contribution"
        paymentFieldsJson <- c.value \\ "paymentFields"
      } yield {
        for {
          user <- userDecoder.decodeJson(userJson)
          contribution <- contributionDecoder.decodeJson(contributionJson)
          paymentFields <- decodePaymentFields.decodeJson(paymentFieldsJson)
        } yield {
          CreatePaymentMethodState(user, contribution, paymentFields)
        }
      }
      state.head
    }
  }
}
