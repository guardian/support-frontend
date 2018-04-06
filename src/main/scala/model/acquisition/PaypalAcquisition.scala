package model.acquisition

import com.gu.acquisition.model.OphanIds
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.paypal.api.payments.Payment
import model.AcquisitionData
import ophan.thrift.event._
import cats.implicits._

case class PaypalAcquisition(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long])

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
          val acquisitionData = paypalAcquisition.acquisitionData
          val transaction = paypalAcquisition.payment.getTransactions.get(0)
          Acquisition(
            product = Product.Contribution,
            paymentFrequency = PaymentFrequency.OneOff,
            currency = transaction.getAmount.getCurrency,
            amount = transaction.getAmount.getTotal.toDouble,
            paymentProvider = Some(ophan.thrift.event.PaymentProvider.Paypal),
            campaignCode = acquisitionData.campaignCodes,
            abTests = acquisitionData.abTests.map(AbTestInfo(_)),
            countryCode = Some(paypalAcquisition.payment.getPayer.getPayerInfo.getCountryCode),
            referrerPageViewId = acquisitionData.referrerPageviewId,
            referrerUrl = acquisitionData.referrerUrl,
            componentId = acquisitionData.componentId,
            componentTypeV2 = acquisitionData.componentType,
            source = acquisitionData.source,
            identityId = paypalAcquisition.identityId.map(x => x.toString),
            platform = acquisitionData.platform.flatMap(Platform.valueOf(_)),
            queryParameters = paypalAcquisition.acquisitionData.queryParameters
          )
        }.leftMap{ error =>
          s"Failed to build an acquisition submission from an instance of PaypalAcquisition - cause: $error"
        }
      }
    }

}
