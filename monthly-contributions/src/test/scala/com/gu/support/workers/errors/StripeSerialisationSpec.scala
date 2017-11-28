package com.gu.support.workers.errors

import com.gu.stripe.Stripe.StripeError
import com.gu.support.workers.Fixtures
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.model.JsonWrapper
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.parser._
import org.scalatest.{FlatSpec, Matchers}

class StripeSerialisationSpec extends FlatSpec with Matchers {
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
    err.isRight should be(true)
    err.right.get.code should be(Some("card_declined"))
  }

  "JsonWrapped error" should "deserialise correctly" in {
    val wrapper = decode[JsonWrapper](Fixtures.cardDeclinedJsonStripe)
    wrapper.isRight should be(true)
    val executionError = wrapper.right.get.error.get
    val errorJson = decode[ErrorJson](executionError.Cause).right.get
    val stripeError = decode[StripeError](errorJson.errorMessage).right.get
    stripeError.code should be(Some("card_declined"))
  }
}
