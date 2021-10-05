package model.acquisition

import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import model.amazonpay.AmazonPaymentData
import model.{AcquisitionData, ClientBrowserInfo}
import ophan.thrift.event._

case class AmazonPayAcquisition(amazonPayment: AmazonPaymentData,
                                acquisitionData: Option[AcquisitionData],
                                identityId: Option[Long],
                                countryCode: Option[String],
                                clientBrowserInfo: ClientBrowserInfo) {
}

object AmazonPayAcquisition {
  implicit val submissionBuilder: AcquisitionSubmissionBuilder[AmazonPayAcquisition] =
    new AcquisitionSubmissionBuilder[AmazonPayAcquisition] {
      override def buildOphanIds(a: AmazonPayAcquisition): Either[String, OphanIds] = Right(OphanIds(None, None, None))

      override def buildAcquisition(amazonPayAcquisition: AmazonPayAcquisition): Either[String, Acquisition] = {
        val payment = amazonPayAcquisition.amazonPayment

        val ophanAcquisition = amazonPayAcquisition.acquisitionData.map(acquisitionData =>
          Acquisition(
            product = Product.Contribution,
            paymentFrequency = PaymentFrequency.OneOff,
            currency = payment.currency.toString,
            amount = payment.amount.toDouble,
            identityId = amazonPayAcquisition.identityId.map(_.toString),
            paymentProvider = Some(ophan.thrift.event.PaymentProvider.AmazonPay),
            campaignCode = acquisitionData.campaignCodes,
            abTests = acquisitionData.abTests.map(AbTestInfo(_)),
            referrerPageViewId = acquisitionData.referrerPageviewId,
            referrerUrl = acquisitionData.referrerUrl,
            componentId = acquisitionData.componentId,
            componentTypeV2 = acquisitionData.componentType,
            source = acquisitionData.source,
            platform = acquisitionData.platform.flatMap(Platform.valueOf),
            queryParameters = acquisitionData.queryParameters,
            countryCode = amazonPayAcquisition.countryCode
          ))

        Either.cond(ophanAcquisition.isDefined, ophanAcquisition.get, "Unable to create Acquisition")
      }

      override def buildGAData(a: AmazonPayAcquisition): Either[String, GAData] = Right(ClientBrowserInfo.toGAData(a.clientBrowserInfo))
    }
}
