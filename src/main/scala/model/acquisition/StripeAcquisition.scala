package model.acquisition

import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import ophan.thrift.event._
import cats.implicits._
import ophan.thrift.event.Acquisition
import com.stripe.model.Charge
import com.typesafe.scalalogging.StrictLogging
import model.ClientBrowserInfo
import model.stripe.{StripeChargeData, StripePaymentMethod}


case class StripeAcquisition(stripeChargeData: StripeChargeData, charge: Charge, identityId: Option[Long], clientBrowserInfo: ClientBrowserInfo)

object StripeAcquisition extends StrictLogging {

  implicit val submissionBuilder: AcquisitionSubmissionBuilder[StripeAcquisition] =
    new AcquisitionSubmissionBuilder[StripeAcquisition] {


      def getStripePaymentProvider(stripePaymentMethod: Option[StripePaymentMethod]): ophan.thrift.event.PaymentProvider = {
        stripePaymentMethod match {
          case Some(StripePaymentMethod.StripeCheckout) | None => ophan.thrift.event.PaymentProvider.Stripe
          case Some(StripePaymentMethod.StripeApplePay) => ophan.thrift.event.PaymentProvider.StripeApplePay
          case Some(StripePaymentMethod.StripePaymentRequestButton) => ophan.thrift.event.PaymentProvider.StripePaymentRequestButton
        }
      }

      override def buildOphanIds(stripeAcquisition: StripeAcquisition): Either[String, OphanIds] = {
        Right(OphanIds(
          stripeAcquisition.stripeChargeData.acquisitionData.pageviewId,
          stripeAcquisition.stripeChargeData.acquisitionData.visitId,
          stripeAcquisition.stripeChargeData.acquisitionData.browserId)
        )
      }

      override def buildGAData(a: StripeAcquisition): Either[String, GAData] =
        Right(ClientBrowserInfo.toGAData(a.clientBrowserInfo))

      override def buildAcquisition(stripeAcquisition: StripeAcquisition): Either[String, Acquisition] = {
        Either.catchNonFatal {
          val paymentData = stripeAcquisition.stripeChargeData.paymentData
          val acquisitionData = stripeAcquisition.stripeChargeData.acquisitionData
          val paymentProvider = getStripePaymentProvider(stripeAcquisition.stripeChargeData.paymentData.stripePaymentMethod)
          Acquisition(
            product = Product.Contribution,
            paymentFrequency = PaymentFrequency.OneOff,
            currency = paymentData.currency.toString,
            amount = paymentData.amount.toDouble,
            paymentProvider = Some(paymentProvider),
            campaignCode = acquisitionData.campaignCodes,
            abTests = acquisitionData.abTests.map(AbTestInfo(_)),
            countryCode = StripeSource.getCountryCode(stripeAcquisition.charge),
            referrerPageViewId = acquisitionData.referrerPageviewId,
            referrerUrl = acquisitionData.referrerUrl,
            componentId = acquisitionData.componentId,
            componentTypeV2 = acquisitionData.componentType,
            source = acquisitionData.source,
            identityId = stripeAcquisition.identityId.map(x => x.toString),
            platform = acquisitionData.platform.flatMap(Platform.valueOf(_)),
            queryParameters = acquisitionData.queryParameters
          )
        }.leftMap{ error =>
          s"Failed to build an acquisition submission from an instance of Stripe Acquisition - cause: $error"
        }
      }
    }
}
