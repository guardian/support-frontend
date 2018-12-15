package services.paypal

import com.gu.support.encoding.Codec._
import com.gu.support.encoding.Codec

// This token is returned from PayPal in the setupPayment step and it will use in the create agreement step.
// (https://developer.paypal.com/docs/classic/express-checkout/integration-guide/ECReference/)
case class Token(token: String)

object Token {
  implicit val codec: Codec[Token] = deriveCodec
}
