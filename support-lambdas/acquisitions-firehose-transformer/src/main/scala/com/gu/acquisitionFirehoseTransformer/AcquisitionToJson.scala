package com.gu.acquisitionFirehoseTransformer

import com.gu.support.acquisitions.AcquisitionDataRow

import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._

import org.joda.time.format.ISODateTimeFormat


object AcquisitionToJson {
  private case class AcquisitionOutput(
    paymentFrequency: String,
    countryCode: String,
    amount: BigDecimal,
    annualisedValue: Double,
    currency: String,
    timestamp: String,
    campaignCode: String,
    componentId: String,
    product: String,
    paymentProvider: String
  )

  def apply(amount: BigDecimal, annualisedValue: Double, acquisition: AcquisitionDataRow): Json = {
    AcquisitionOutput(
      acquisition.paymentFrequency.value,
      acquisition.country.alpha2,
      amount,
      annualisedValue,
      acquisition.currency.iso,
      ISODateTimeFormat.dateTime().print(acquisition.eventTimeStamp),
      acquisition.campaignCode.getOrElse(""),
      acquisition.componentId.getOrElse(""),
      acquisition.product.value,
      acquisition.paymentProvider.map(_.value).getOrElse("")
    ).asJson
  }
}
