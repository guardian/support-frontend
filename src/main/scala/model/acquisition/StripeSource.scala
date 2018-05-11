package model.acquisition

import com.stripe.model.Charge
import io.circe.parser.decode
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.JsonCodec

@JsonCodec case class StripeSource(country: String)

object StripeSource extends StrictLogging {

  def getCountryCode(charge: Charge): Option[String] = {
    // Some Stripe charges have the country field set to null.
    // In this instance decoding will fail
    // and the respective record in Postgres and the data lake
    // won't have a country code field
    decode[StripeSource](charge.getSource.toJson).map(_.country).toOption
  }
}
