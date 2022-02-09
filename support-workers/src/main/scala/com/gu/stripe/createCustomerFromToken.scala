package com.gu.stripe

import com.gu.stripe.Stripe.StripeList
import com.gu.stripe.createCustomerFromToken.Customer.StripeCard
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.Future

object createCustomerFromToken {

  object Customer {
    implicit val decoder: Decoder[Customer] = deriveDecoder

    object StripeCard {

      implicit val brandDecoder = StripeBrand.decoder(_.customerValue)
      implicit val decoder: Decoder[StripeCard] = deriveDecoder

    }

    case class StripeCard(id: String, brand: StripeBrand, last4: String, exp_month: Int, exp_year: Int, country: String)

  }

  case class Customer(id: String, sources: StripeList[StripeCard]) {
    // customers should always have a card
    if (sources.total_count != 1) {
      throw StripeError("internal", s"Customer $id has ${sources.total_count} cards, should have exactly one")
    }

    val source = sources.data.head
  }

  def apply(stripeService: StripeServiceForCurrency)(token: String): Future[Customer] =
    stripeService.postForm[Customer](
      "customers",
      Map(
        "source" -> Seq(token),
      ),
    )
}
