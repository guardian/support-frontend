package com.gu.stripe

import com.gu.stripe.Stripe.StripeError
import io.circe.parser._
import org.scalatest.{FlatSpec, Matchers}

class StripeSerialisationSpec extends FlatSpec with Matchers{
  "Stripe error" should "deserialise correctly" in {
    val err = decode[StripeError](
      """{
          "error": {
            "message": "Your card was declined.",
            "type": "card_error",
            "param": "",
            "code": "card_declined",
            "decline_code": "generic_decline"
          }
        }
      """
    )
    err.isRight should be (true)
    err.right.get.code should be (Some("card_declined"))
  }
}
