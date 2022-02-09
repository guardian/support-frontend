package com.gu.support.workers

import com.gu.stripe.StripeError
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class CirceEncodingBehaviourSpec extends AnyFlatSpec with Matchers with LazyLogging {

  /** The behaviour of circe with regard to encoding and decoding subclasses is rather specific. If we have a
    * PayPalReferenceTransaction typed as a PaymentMethod (its superclass) the json produced will be: {
    * "PayPalReferenceTransaction" : { "baId" : "123", "email" : "test@test.com" } } * Whereas the same object typed as
    * a PayPalReferenceTransaction will serialise to: { "baId" : "123", "email" : "test@test.com" } * As a result of
    * this we need to decode back to the exact type which we encoded from or we will get a decoding failure. * The tests
    * below just encode an illustration of this
    */

  "Circe" should "be able to decode PaymentMethod from PaymentMethod" in {
    val pprt: PaymentMethod = PayPalReferenceTransaction("123", "test@test.com")
    val json = pprt.asJson
    // logger.info(json.spaces2)
    /*
    {
      "PaypalBaid" : "123",
      "PaypalEmail" : "test@test.com",
      "PaypalType" : "ExpressCheckout",
      "Type" : "PayPal"
    }
     */
    val pprt2 = decode[PaymentMethod](json.noSpaces)
    pprt2.isRight should be(true) // decoding succeeded
  }

  it should "be able to decode PayPalReferenceTransaction from PayPalReferenceTransaction" in {
    val pprt = PayPalReferenceTransaction("123", "test@test.com")
    val json = pprt.asJson
    // logger.info(json.spaces2)
    /*
    {
      "PaypalBaid" : "123",
      "PaypalEmail" : "test@test.com",
      "PaypalType" : "ExpressCheckout",
      "Type" : "PayPal"
    }
     */
    val pprt2 = decode[PayPalReferenceTransaction](json.noSpaces)
    pprt2.isRight should be(true) // decoding succeeded
  }

  it should "be able to decode PayPalReferenceTransaction from PaymentMethod" in {
    val pprt: PaymentMethod = PayPalReferenceTransaction("123", "test@test.com")
    val json = pprt.asJson
    val pprt2 = decode[PayPalReferenceTransaction](json.noSpaces)
    pprt2.isRight should be(true) // decoding succeeded
  }

  it should "be able to decode PaymentMethod from PayPalReferenceTransaction" in {
    val pprt = PayPalReferenceTransaction("123", "test@test.com")
    val json = pprt.asJson
    val pprt2 = decode[PaymentMethod](json.noSpaces)
    pprt2.isRight should be(true) // decoding succeeded
  }

  it should "be able to decode a stripe error" in {
    val json = """
      |{
      |  "error": {
      |    "type": "invalid_request_error",
      |    "message": "You cannot use a Stripe token more than once: tok_IRqAu50hjXnumI."
      |  }
      |}""".stripMargin
    val decoded = decode[StripeError](json)
    decoded.isRight should be(true)
    decoded.map(_.`type`) should be(Right("invalid_request_error"))
  }
}
