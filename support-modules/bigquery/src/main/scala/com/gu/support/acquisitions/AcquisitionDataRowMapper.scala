package com.gu.support.acquisitions

import com.gu.support.workers._
import org.joda.time.format.ISODateTimeFormat
import scala.collection.JavaConverters._

import java.util

object AcquisitionDataRowMapper {

  def mapToTableRow(acquisition: AcquisitionDataRow): util.Map[String, Any] = {

    val optionalFields = List(
      acquisition.promoCode.map("promo_code" -> _),
      acquisition.paymentProvider.map("payment_provider" -> paymentProviderName(_)),
      acquisition.printOptions.map(p => "print_options" -> Map(
        "product" -> p.product,
        "delivery_country_code" -> p.deliveryCountry.alpha2
      )),
      acquisition.amount.map("amount" -> _),
      acquisition.identityId.map("identity_id" -> _),
      acquisition.pageViewId.map("page_view_id" -> _),
      acquisition.browserId.map("browser_id" -> _),
      acquisition.referrerPageViewId.map("referrer_page_view_id" -> _),
      acquisition.referrerUrl.map("referrer_url" -> _),
      acquisition.componentId.map("component_id" -> _),
      acquisition.componentType.map("component_type" -> _),
      acquisition.source.map("source" -> _),
      acquisition.campaignCode.map("campaign_codes" -> List(_).asJava),
    ).flatten.toMap

    (Map(
      "event_timestamp" -> ISODateTimeFormat.dateTime().print(acquisition.eventTimeStamp),
      "product" -> acquisition.product.value,
      "payment_frequency" -> paymentFrequencyFromBillingPeriod(acquisition.paymentFrequency),
      "country_code" -> acquisition.country.alpha2,
      "currency" -> acquisition.currency.iso,
      "reused_existing_payment_method" -> acquisition.reusedExistingPaymentMethod,
      "acquisition_type" -> acquisition.acquisitionType.value,
      "reader_type" -> acquisition.readerType.value.toUpperCase,
      "query_parameters" -> acquisition.queryParameters,
      "ab_tests" -> mapAbTests(acquisition.abTests),
      "query_parameters" -> mapQueryParameters(acquisition.queryParameters),
      "labels" -> acquisition.labels.asJava,
      "platform" -> "SUPPORT",
    ) ++ optionalFields).asJava

  }

  private def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod) =
    billingPeriod match {
      case Monthly => "MONTHLY"
      case Quarterly | SixWeekly => "QUARTERLY"
      case Annual => "ANNUALLY"
    }

  def paymentProviderName(provider: PaymentProvider) = provider match {
    case PayPal => "PAYPAL"
    case DirectDebit => "GOCARDLESS"
    case Stripe => "STRIPE"
    case StripeApplePay => "STRIPE_APPLE_PAY"
    case StripePaymentRequestButton => "STRIPE_PAYMENT_REQUEST_BUTTON"
  }

  private def mapAbTests(abtests: List[AbTest]) =
    abtests.map(abTest =>
      Map(
        "name" -> abTest.name,
        "variant" -> abTest.variant
      ).asJava).asJava

  private def mapQueryParameters(queryParameters: List[QueryParameter]) =
    queryParameters.map(queryParam =>
      Map(
        "key" -> queryParam.name,
        "value" -> queryParam.value
      ).asJava).asJava

}
