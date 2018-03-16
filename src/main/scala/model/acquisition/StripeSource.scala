package model.acquisition

import com.stripe.model.Charge
import io.circe.parser.decode
import cats.implicits._
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.JsonCodec

@JsonCodec case class StripeSource(country: String)

object StripeSource extends StrictLogging {

  def getCountryCode(charge: Charge): Option[String] = {
    decode[StripeSource](charge.getSource.toJson)
      .bimap(
        err =>
          logger.error("Could not extract country code from Stripe charge: " + err.toString),
        source => source.country
      ).toOption
  }
}
