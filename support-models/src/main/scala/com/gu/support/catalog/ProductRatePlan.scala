package com.gu.support.catalog

import com.gu.support.encoding.JsonHelpers._
import com.gu.support.workers.BillingPeriod
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{ACursor, Decoder, Encoder, Json}

case class ProductRatePlan(id: ProductRatePlanId, billingPeriod: BillingPeriod, prices: List[Price])

object ProductRatePlan {
  import com.gu.support.encoding.CustomCodecs._

  implicit val decoder: Decoder[ProductRatePlan] = deriveDecoder[ProductRatePlan].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject { jsonObject =>
      val pricing = jsonObject("productRatePlanCharges")
        .flatMap{json =>
          json.\\("pricing").headOption
        }
        .getOrElse(Json.Null)

      jsonObject
        .renameField("FrontendId__c", "billingPeriod")
        .defaultIfNull("billingPeriod", Json.fromString(""))
        .add("prices", pricing)
    }
  }

  implicit val encoder: Encoder[ProductRatePlan] = deriveEncoder
}
