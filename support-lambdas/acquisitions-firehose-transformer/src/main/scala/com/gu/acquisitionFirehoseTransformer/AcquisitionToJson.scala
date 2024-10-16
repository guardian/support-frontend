package com.gu.acquisitionFirehoseTransformer

import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.acquisitions.AbTest
import io.circe.{Encoder, Json}
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import org.joda.time.format.DateTimeFormat

object AcquisitionToJson {

  val dtFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")

  case class AcquisitionOutput(
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
      abTests: List[AbTest],
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
      acquisition.abTests,
    ).asJson
  }

  implicit val encoder: Encoder[AcquisitionOutput] = deriveEncoder
}
