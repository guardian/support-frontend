package model.acquisition

import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import model.ClientBrowserInfo
import model.subscribewithgoogle.GoogleRecordPayment
import ophan.thrift.event.{Acquisition, PaymentFrequency, Product}

case class SubscribeWithGoogleAcquisition(googleRecordPayment: GoogleRecordPayment,
                                          identityId: Option[Long],
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
        amount = a.googleRecordPayment.amount.toDouble,
        identityId = a.identityId.map(_.toString()),
        paymentProvider = Some(ophan.thrift.event.PaymentProvider.SubscribeWithGoogle)
      ))

      override def buildGAData(a: SubscribeWithGoogleAcquisition): Either[String, GAData] = Right(ClientBrowserInfo.toGAData(a.clientBrowserInfo))
    }
}
