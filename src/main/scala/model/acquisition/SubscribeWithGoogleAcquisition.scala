package model.acquisition

import java.util.UUID

import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import model.ClientBrowserInfo
import model.subscribewithgoogle.GoogleRecordPayment
import ophan.thrift.event.{Acquisition, PaymentFrequency, Product}

case class SubscribeWithGoogleAcquisition(googleRecordPayment: GoogleRecordPayment,
                                          identityId: Long,
                                          clientBrowserInfo: ClientBrowserInfo) {
}

object SubscribeWithGoogleAcquisition {
  implicit val submissionBuilder: AcquisitionSubmissionBuilder[SubscribeWithGoogleAcquisition] =
    new AcquisitionSubmissionBuilder[SubscribeWithGoogleAcquisition] {
      override def buildOphanIds(a: SubscribeWithGoogleAcquisition): Either[String, OphanIds] = Right(OphanIds(None, None, None))

      override def buildAcquisition(a: SubscribeWithGoogleAcquisition): Either[String, Acquisition] = Right(Acquisition(
        product = Product.Contribution,
        paymentFrequency = PaymentFrequency.OneOff,
        currency = a.googleRecordPayment.currency,
        amount = a.googleRecordPayment.amount.toDouble
      )) //todo: Potentially add SWiG to the com.gu.acquisition enum for payment provider if required

      override def buildGAData(a: SubscribeWithGoogleAcquisition): Either[String, GAData] = Right(ClientBrowserInfo.toGAData(a.clientBrowserInfo))
    }
}
