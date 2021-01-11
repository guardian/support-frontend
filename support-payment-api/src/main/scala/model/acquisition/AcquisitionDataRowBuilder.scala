package model.acquisition

import com.gu.i18n.Currency._
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.acquisitions
import com.gu.support.acquisitions.PaymentProvider.{AmazonPay, PayPal, Stripe, StripeApplePay, StripePaymentRequestButton}
import com.gu.support.acquisitions._
import com.gu.support.zuora.api.ReaderType
import model.{Currency => ModelCurrency}
import model.Currency.{AUD => ModelAUD, CAD => ModelCAD, EUR => ModelEUR, GBP => ModelGBP, NZD => ModelNZD, USD => ModelUSD}
import model.db.ContributionData
import model.stripe.StripePaymentMethod
import ophan.thrift.event.{AbTest, QueryParameter => ThriftQueryParam}
import org.joda.time.{DateTime, DateTimeZone}

object AcquisitionDataRowBuilder {
  def buildFromStripe(acquisition: StripeAcquisition, contributionData: ContributionData): AcquisitionDataRow = {
    val paymentData = acquisition.stripeChargeData.paymentData
    val acquisitionData = acquisition.stripeChargeData.acquisitionData
    val paymentProvider = mapStripePaymentProvider(acquisition.stripeChargeData.paymentData.stripePaymentMethod)

    AcquisitionDataRow(
      eventTimeStamp = DateTime.now(DateTimeZone.UTC),
      product = AcquisitionProduct.Contribution,
      amount = Some(paymentData.amount),
      country = StripeCharge.getCountryCode(acquisition.charge).flatMap(CountryGroup.countryByName).getOrElse(Country.UK),
      currency = mapCurrency(paymentData.currency),
      componentId = acquisitionData.componentId,
      componentType = acquisitionData.componentType.map(_.originalName),
      campaignCode = acquisitionData.campaignCodes.map(_.mkString(", ")),
      source = acquisitionData.source.map(_.originalName),
      referrerUrl = acquisitionData.referrerUrl,
      abTests = mapAbTests(acquisitionData.abTests),
      paymentFrequency = PaymentFrequency.OneOff,
      paymentProvider = Some(paymentProvider),
      printOptions = None,
      browserId = acquisitionData.browserId,
      identityId = acquisition.identityId.map(_.toString),
      pageViewId = acquisitionData.pageviewId,
      referrerPageViewId = acquisitionData.referrerPageviewId,
      labels = Nil,
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      zuoraAccountNumber = None,
      contributionId = Some(contributionData.contributionId.toString),
      queryParameters = mapQueryParams(acquisitionData.queryParameters),
      platform = acquisitionData.platform
    )
  }

  def buildFromAmazonPay(acquisition: AmazonPayAcquisition, contributionData: ContributionData): AcquisitionDataRow = {
    val paymentData = acquisition.amazonPayment
    val acquisitionData = acquisition.acquisitionData

    AcquisitionDataRow(
      eventTimeStamp = DateTime.now(DateTimeZone.UTC),
      product = AcquisitionProduct.Contribution,
      amount = Some(paymentData.amount),
      country = acquisition.countryCode.flatMap(CountryGroup.countryByName).getOrElse(Country.UK),
      currency = mapCurrency(paymentData.currency),
      componentId = acquisitionData.flatMap(_.componentId),
      componentType = acquisitionData.flatMap(_.componentType.map(_.originalName)),
      campaignCode = acquisitionData.flatMap(_.campaignCodes.map(_.mkString(", "))),
      source = acquisitionData.flatMap(_.source.map(_.originalName)),
      referrerUrl = acquisitionData.flatMap(_.referrerUrl),
      abTests = mapAbTests(acquisitionData.flatMap(_.abTests)),
      paymentFrequency = PaymentFrequency.OneOff,
      paymentProvider = Some(AmazonPay),
      printOptions = None,
      browserId = acquisitionData.flatMap(_.browserId),
      identityId = acquisition.identityId.map(_.toString),
      pageViewId = acquisitionData.flatMap(_.pageviewId),
      referrerPageViewId = acquisitionData.flatMap(_.referrerPageviewId),
      labels = Nil,
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      zuoraAccountNumber = None,
      contributionId = Some(contributionData.contributionId.toString),
      queryParameters = mapQueryParams(acquisitionData.flatMap(_.queryParameters)),
      platform = acquisitionData.flatMap(_.platform)
    )
  }

  def buildFromPayPal(acquisition: PaypalAcquisition, contributionData: ContributionData): AcquisitionDataRow = {
    val acquisitionData = acquisition.acquisitionData
    val transaction = acquisition.payment.getTransactions.get(0)
    val country = CountryGroup.countryByName(acquisition.payment.getPayer.getPayerInfo.getCountryCode).getOrElse(Country.UK)

    AcquisitionDataRow(
      eventTimeStamp = DateTime.now(DateTimeZone.UTC),
      product = AcquisitionProduct.Contribution,
      amount = Some(transaction.getAmount.getTotal.toDouble),
      country = country,
      currency = Currency.fromString(transaction.getAmount.getCurrency).getOrElse(GBP),
      componentId = acquisitionData.componentId,
      componentType = acquisitionData.componentType.map(_.originalName),
      campaignCode = acquisitionData.campaignCodes.map(_.mkString(", ")),
      source = acquisitionData.source.map(_.originalName),
      referrerUrl = acquisitionData.referrerUrl,
      abTests = mapAbTests(acquisitionData.abTests),
      paymentFrequency = PaymentFrequency.OneOff,
      paymentProvider = Some(PayPal),
      printOptions = None,
      browserId = acquisitionData.browserId,
      identityId = acquisition.identityId.map(_.toString),
      pageViewId = acquisitionData.pageviewId,
      referrerPageViewId = acquisitionData.referrerPageviewId,
      labels = Nil,
      promoCode = None,
      reusedExistingPaymentMethod = false,
      readerType = ReaderType.Direct,
      acquisitionType = AcquisitionType.Purchase,
      zuoraSubscriptionNumber = None,
      zuoraAccountNumber = None,
      contributionId = Some(contributionData.contributionId.toString),
      queryParameters = mapQueryParams(acquisitionData.queryParameters),
      platform = acquisitionData.platform
    )
  }

  def mapAbTests(maybeTests: Option[Set[AbTest]]) =
    maybeTests.map(
      _.map(abTest =>
        acquisitions.AbTest(
          abTest.name,
          abTest.variant
        )).toList
    ).getOrElse(Nil)

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

  def mapQueryParams(maybeThriftParameters: Option[Set[ThriftQueryParam]]) =
    maybeThriftParameters.map(_.toList.map(
      thriftQueryParam => QueryParameter(thriftQueryParam.name, thriftQueryParam.value)
    )).getOrElse(Nil)

}
