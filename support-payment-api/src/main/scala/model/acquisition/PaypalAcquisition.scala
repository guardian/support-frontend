package model.acquisition

import com.paypal.api.payments.Payment
import model.{AcquisitionData, ClientBrowserInfo}

case class PaypalAcquisition(
    payment: Payment,
    acquisitionData: AcquisitionData,
    identityId: Option[Long],
    clientBrowserInfo: ClientBrowserInfo,
)
