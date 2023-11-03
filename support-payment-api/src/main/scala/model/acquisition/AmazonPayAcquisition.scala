package model.acquisition

import model.amazonpay.AmazonPaymentData
import model.{AcquisitionData, ClientBrowserInfo}

case class AmazonPayAcquisition(
    amazonPayment: AmazonPaymentData,
    acquisitionData: Option[AcquisitionData],
    identityId: Option[String],
    countryCode: Option[String],
    clientBrowserInfo: ClientBrowserInfo,
) {}
