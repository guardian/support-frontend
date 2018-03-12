package model.acquisition

import com.gu.acquisition.model.OphanIds
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.paypal.api.payments.Payment
import model.AcquisitionData
import ophan.thrift.event._
import cats.implicits._

case class PaypalAcquisition(payment: Payment, acquisitionData: AcquisitionData)

object PaypalAcquisition {

  implicit val submissionBuilder: AcquisitionSubmissionBuilder[PaypalAcquisition] =
    new AcquisitionSubmissionBuilder[PaypalAcquisition] {

      override def buildOphanIds(paypalAcquisition: PaypalAcquisition): Either[String, OphanIds] = {
        Right(OphanIds(
          paypalAcquisition.acquisitionData.pageviewId,
          paypalAcquisition.acquisitionData.visitId,
          paypalAcquisition.acquisitionData.browserId)
        )
      }

      override def buildAcquisition(paypalAcquisition: PaypalAcquisition): Either[String, Acquisition] = {
        Either.catchNonFatal {
          val transaction = paypalAcquisition.payment.getTransactions.get(0)
          Acquisition(
            product = Product.Contribution,
            paymentFrequency = PaymentFrequency.OneOff,
            currency = transaction.getAmount.getCurrency,
            amount = transaction.getAmount.getTotal.toDouble,
            paymentProvider = Some(ophan.thrift.event.PaymentProvider.Paypal),
            campaignCode = paypalAcquisition.acquisitionData.campaignCodes,
            abTests = paypalAcquisition.acquisitionData.abTests.map(AbTestInfo(_)),
            countryCode = Some(paypalAcquisition.payment.getPayer.getPayerInfo.getCountryCode),
            referrerPageViewId = paypalAcquisition.acquisitionData.referrerPageviewId,
            referrerUrl = paypalAcquisition.acquisitionData.referrerUrl,
            componentId = paypalAcquisition.acquisitionData.componentId,
            componentTypeV2 = paypalAcquisition.acquisitionData.componentType,
            source = paypalAcquisition.acquisitionData.source,
            platform = paypalAcquisition.acquisitionData.platform.flatMap(Platform.valueOf(_))
          )
        }.leftMap{ error =>
          s"Failed to build an acquisition submission from an instance of PaypalAcquisition - cause: $error"
        }
      }
    }

}
