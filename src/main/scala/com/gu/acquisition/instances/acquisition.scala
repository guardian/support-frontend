package com.gu.acquisition.instances

import io.circe.{Encoder, Json}
import ophan.thrift.event.Acquisition

trait AcquisitionInstances {

  implicit val acquisitionEncoder: Encoder[Acquisition] = Encoder.instance { acquisition =>
    import abTestInfo._
    import io.circe.syntax._
    import acquisition._

    Json.obj(
      "product" -> product.name.asJson,
      "paymentFrequency" -> paymentFrequency.name.asJson,
      "currency" -> currency.asJson,
      "amount" -> amount.asJson,
      "amountInGBP" -> amount.asJson,
      "paymentProvider" -> paymentProvider.map(_.name).asJson,
      "campaignCode" -> campaignCode.asJson,
      "abTests" -> abTests.asJson,
      "countryCode" -> countryCode.asJson,
      "referrerPageViewId" -> referrerPageViewId.asJson,
      "referrerUrl" -> referrerUrl.asJson,
      "componentId" -> componentId.asJson,
      "componentType" -> acquisition.componentTypeV2.map(_.name).asJson,
      "source" -> acquisition.source.map(_.name).asJson
    )
  }
}
