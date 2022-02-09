package model.acquisition

import com.stripe.model.Charge
import com.typesafe.scalalogging.StrictLogging

import scala.util.Try

object StripeCharge extends StrictLogging {

  def getCountryCode(charge: Charge): Option[String] = {
    // Wrapped in a Try in case any of the fields is null.
    // In this case the respective record in Postgres and the data lake
    // won't have a country code field
    Try(charge.getPaymentMethodDetails.getCard.getCountry).fold(
      error => {
        logger.warn(s"Unable to get country from Charge object: ${error.getMessage}", error)
        None
      },
      Some(_),
    )
  }
}
