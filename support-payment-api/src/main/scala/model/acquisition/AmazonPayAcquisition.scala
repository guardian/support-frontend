package model.acquisition

import model.amazonpay.AmazonPaymentData
import model.{AcquisitionData, ClientBrowserInfo}

case class AmazonPayAcquisition(
    amazonPayment: AmazonPaymentData,
    acquisitionData: Option[AcquisitionData],
    identityId: Option[Long],
    countryCode: Option[String],
    clientBrowserInfo: ClientBrowserInfo,
) {}
