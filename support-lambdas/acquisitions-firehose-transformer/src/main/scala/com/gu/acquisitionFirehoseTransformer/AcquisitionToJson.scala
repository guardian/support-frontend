package com.gu.acquisitionFirehoseTransformer

import com.gu.support.acquisitions.models.AcquisitionDataRow

import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._

import org.joda.time.format.DateTimeFormat

object AcquisitionToJson {

  val dtFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")

  private case class AcquisitionOutput(
      paymentFrequency: String,
      countryCode: String,
      amount: BigDecimal,
      annualisedValue: Double,
      annualisedValueGBP: Double,
      currency: String,
      timestamp: String,
      campaignCode: String,
      componentId: String,
      product: String,
      paymentProvider: String,
      referrerUrl: String,
      labels: List[String],
  )

  def apply(
      amount: BigDecimal,
      annualisedValue: Double,
      annualisedValueGBP: Double,
      acquisition: AcquisitionDataRow,
  ): Json = {
    AcquisitionOutput(
      acquisition.paymentFrequency.value,
      acquisition.country.alpha2,
      amount,
      annualisedValue,
      annualisedValueGBP,
      acquisition.currency.iso,
      dtFormatter.print(acquisition.eventTimeStamp),
      acquisition.campaignCode.getOrElse(""),
      acquisition.componentId.getOrElse(""),
      acquisition.product.value,
      acquisition.paymentProvider.map(_.value).getOrElse(""),
      acquisition.referrerUrl.getOrElse(""),
      acquisition.labels,
    ).asJson
  }
}
