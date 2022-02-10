package model.acquisition

import com.stripe.model.Charge
import model.ClientBrowserInfo
import model.stripe.StripeRequest

case class StripeAcquisition(
    stripeChargeData: StripeRequest,
    charge: Charge,
    identityId: Option[Long],
    clientBrowserInfo: ClientBrowserInfo,
)
