package utils

import ophan.thrift.event.Acquisition

object AcquisitionUtils {

  import io.circe.syntax._

  def formatAmount(amount: Double, currencyCode: String): Double =
    if (currencyCode.equalsIgnoreCase("jpy")) amount else amount / 100

  def queryParamsFor(acquisition: Acquisition): Map[String, String] = {
    import instances.abTestInfo._

    Map(
      "product" -> Some(acquisition.product.toString),
      "currency" -> Some(acquisition.currency.toString),
      "paymentFrequency" -> Some(acquisition.paymentFrequency.toString),
      "amount" -> Some(acquisition.amount.toString),
      "amountInGBP" -> acquisition.amountInGBP.map(_.toString),
      "paymentProvider" -> acquisition.paymentProvider.map(_.toString),
      "campaignCode" -> acquisition.campaignCode.map(_.mkString(",")),
      "abTests" -> acquisition.abTests.map(ab => ab.asJson.noSpaces),
      "countryCode" -> acquisition.countryCode,
      "referrerPageViewId" -> acquisition.referrerPageViewId,
      "referrerUrl" -> acquisition.referrerUrl,
      "componentId" -> acquisition.componentId,
      "componentType" -> acquisition.componentTypeV2.map(_.name),
      "source" -> acquisition.source.map(_.name)
    ).collect { case (k, Some(v)) => k -> v }
  }
}