package model.acquisition

import com.gu.i18n.Currency._
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.acquisitions.models.PaymentProvider.{PayPal, Stripe, StripeApplePay, StripePaymentRequestButton}
import com.gu.support.acquisitions.models._
import com.gu.support.zuora.api.ReaderType
import model.{Currency => ModelCurrency}
import model.Currency.{
  AUD => ModelAUD,
  CAD => ModelCAD,
  EUR => ModelEUR,
  GBP => ModelGBP,
  NZD => ModelNZD,
  USD => ModelUSD,
}
import model.db.ContributionData
import model.stripe.StripePaymentMethod
import org.joda.time.{DateTime, DateTimeZone}
import scala.jdk.CollectionConverters._

object AcquisitionDataRowBuilder {
  def buildFromStripe(
      acquisition: StripeAcquisition,
      contributionData: ContributionData,
  ): AcquisitionDataRow = {
    val paymentData = acquisition.stripeChargeData.paymentData
    val acquisitionData = acquisition.stripeChargeData.acquisitionData
    val paymentProvider = mapStripePaymentProvider(acquisition.stripeChargeData.paymentData.stripePaymentMethod)

    AcquisitionDataRow(
      eventTimeStamp = DateTime.now(DateTimeZone.UTC),
      product = AcquisitionProduct.Contribution,
      amount = Some(paymentData.amount),
      country =
        StripeCharge.getCountryCode(acquisition.charge).flatMap(CountryGroup.countryByCode).getOrElse(Country.UK),
      currency = mapCurrency(paymentData.currency),
      componentId = acquisitionData.componentId,
      componentType = acquisitionData.componentType,
      campaignCode = acquisitionData.campaignCodes.map(_.mkString(", ")),
      source = acquisitionData.source,
      referrerUrl = acquisitionData.referrerUrl,
      abTests = acquisitionData.abTests.map(_.toList).getOrElse(Nil),
      paymentFrequency = PaymentFrequency.OneOff,
      paymentProvider = Some(paymentProvider),
      printOptions = None,
      browserId = acquisitionData.browserId,
      identityId = acquisition.identityId.map(_.toString),
      pageViewId = acquisitionData.pageviewId,
      referrerPageViewId = acquisitionData.referrerPageviewId,
      labels = acquisitionData.labels.map(_.toList).getOrElse(Nil),
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      contributionId = Some(contributionData.contributionId.toString),
      paymentId = Some(contributionData.paymentId),
      queryParameters = acquisitionData.queryParameters.map(_.toList).getOrElse(Nil),
      platform = acquisitionData.platform,
      postalCode = contributionData.postalCode,
      state = contributionData.countrySubdivisionCode,
      email = Some(contributionData.email),
      similarProductsConsent = acquisition.stripeChargeData.similarProductsConsent,
      paypalTransactionId = None,
    )
  }

  def buildFromPayPal(
      acquisition: PaypalAcquisition,
      contributionData: ContributionData,
      similarProductsConsent: Option[Boolean],
  ): AcquisitionDataRow = {
    val acquisitionData = acquisition.acquisitionData
    val transaction = acquisition.payment.getTransactions.get(0)
    val country =
      CountryGroup.countryByCode(acquisition.payment.getPayer.getPayerInfo.getCountryCode).getOrElse(Country.UK)

    // This identifier can be used to look up the PayPal transaction in the PayPal dashboard, so
    // is useful to CSRs (among others).
    val maybeTransactionId = for {
      transaction <- acquisition.payment.getTransactions.asScala.headOption
      relatedResource <- transaction.getRelatedResources.asScala.headOption
      sale = relatedResource.getSale
    } yield sale.getId

    AcquisitionDataRow(
      eventTimeStamp = DateTime.now(DateTimeZone.UTC),
      product = AcquisitionProduct.Contribution,
      amount = Some(transaction.getAmount.getTotal.toDouble),
      country = country,
      currency = Currency.fromString(transaction.getAmount.getCurrency).getOrElse(GBP),
      componentId = acquisitionData.componentId,
      componentType = acquisitionData.componentType,
      campaignCode = acquisitionData.campaignCodes.map(_.mkString(", ")),
      source = acquisitionData.source,
      referrerUrl = acquisitionData.referrerUrl,
      abTests = acquisitionData.abTests.map(_.toList).getOrElse(Nil),
      paymentFrequency = PaymentFrequency.OneOff,
      paymentProvider = Some(PayPal),
      printOptions = None,
      browserId = acquisitionData.browserId,
      identityId = acquisition.identityId.map(_.toString),
      pageViewId = acquisitionData.pageviewId,
      referrerPageViewId = acquisitionData.referrerPageviewId,
      labels = acquisitionData.labels.map(_.toList).getOrElse(Nil),
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      contributionId = Some(contributionData.contributionId.toString),
      paymentId = Some(contributionData.paymentId),
      queryParameters = acquisitionData.queryParameters.map(_.toList).getOrElse(Nil),
      platform = acquisitionData.platform,
      postalCode = contributionData.postalCode,
      state = contributionData.countrySubdivisionCode,
      email = Some(contributionData.email),
      similarProductsConsent = similarProductsConsent,
      paypalTransactionId = maybeTransactionId,
    )
  }

  def mapStripePaymentProvider(stripePaymentMethod: Option[StripePaymentMethod]): PaymentProvider =
    stripePaymentMethod match {
      case Some(StripePaymentMethod.StripeCheckout) | None => Stripe
      case Some(StripePaymentMethod.StripeApplePay) => StripeApplePay
      case Some(StripePaymentMethod.StripePaymentRequestButton) => StripePaymentRequestButton
    }

  def mapCurrency(model: ModelCurrency): Currency =
    model match {
      case ModelGBP => GBP
      case ModelEUR => EUR
      case ModelUSD => USD
      case ModelAUD => AUD
      case ModelCAD => CAD
      case ModelNZD => NZD
    }
}
