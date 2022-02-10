package com.gu.support.acquisitions

import com.gu.support.acquisitions.models._
import com.gu.support.workers._
import org.joda.time.format.ISODateTimeFormat
import scala.collection.JavaConverters._

import java.util

object AcquisitionDataRowMapper {

  def mapToTableRow(acquisition: AcquisitionDataRow): util.Map[String, Any] = {

    val optionalFields = List(
      acquisition.promoCode.map("promo_code" -> _),
      acquisition.paymentProvider.map("payment_provider" -> _.value),
      acquisition.printOptions.map(p =>
        "print_options" -> Map(
          "product" -> p.product.value,
          "delivery_country_code" -> p.deliveryCountry.alpha2,
        ).asJava,
      ),
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
      acquisition.zuoraAccountNumber.map("zuora_account_number" -> _),
      acquisition.zuoraSubscriptionNumber.map("zuora_subscription_number" -> _),
      acquisition.contributionId.map("contribution_id" -> _),
      acquisition.paymentId.map("payment_id" -> _),
    ).flatten.toMap

    (Map(
      "event_timestamp" -> ISODateTimeFormat.dateTime().print(acquisition.eventTimeStamp),
      "product" -> acquisition.product.value,
      "payment_frequency" -> acquisition.paymentFrequency.value,
      "country_code" -> acquisition.country.alpha2,
      "currency" -> acquisition.currency.iso,
      "reused_existing_payment_method" -> acquisition.reusedExistingPaymentMethod,
      "acquisition_type" -> acquisition.acquisitionType.value,
      "reader_type" -> acquisition.readerType.value.toUpperCase,
      "query_parameters" -> acquisition.queryParameters,
      "ab_tests" -> mapAbTests(acquisition.abTests),
      "query_parameters" -> mapQueryParameters(acquisition.queryParameters),
      "labels" -> acquisition.labels.asJava,
      "platform" -> acquisition.platform.map(mapPlatformName).getOrElse("SUPPORT"),
    ) ++ optionalFields).asJava

  }

  def mapPlatformName(name: String) =
    name.toLowerCase match {
      case "iosnativeapp" => "IOS_NATIVE_APP"
      case "androidnativeapp" => "ANDROID_NATIVE_APP"
      case _ => name
    }

  private def mapAbTests(abtests: List[AbTest]) =
    abtests
      .map(abTest =>
        Map(
          "name" -> abTest.name,
          "variant" -> abTest.variant,
        ).asJava,
      )
      .asJava

  private def mapQueryParameters(queryParameters: List[QueryParameter]) =
    queryParameters
      .map(queryParam =>
        Map(
          "key" -> queryParam.name,
          "value" -> queryParam.value,
        ).asJava,
      )
      .asJava

}
