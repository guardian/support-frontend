package com.gu.support

import java.time.DayOfWeek

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import io.circe.generic.semiauto.deriveDecoder
import io.circe.generic.auto._
import io.circe.{Decoder, Json}

package object catalog {

  //The rate plan for a particular product
  type ProductRatePlanId = String

  //case class ProductId(value: String) extends AnyVal
  type ProductId = String

  type ProductRatePlanChargeId = String

  case class Pricing(
    currency: Currency,
    price: Double
  )

  sealed trait ProductType {
    val id: String
  }

  case class ProductRatePlanCharge(
    id: ProductRatePlanChargeId,
    name: String,
    endDateCondition: Option[String],
    pricing: List[Pricing],
    productType: Option[ProductRatePlanChargeType]
  )

  object ProductRatePlanCharge {
    implicit val productRatePlanChargeDecoder: Decoder[ProductRatePlanCharge] = deriveDecoder[ProductRatePlanCharge].prepare {
      _.withFocus {
        _.mapObject { jsonObject =>
          val existingValue = jsonObject("ProductType__c").map(j =>
            if (j.isNull)
              Json.fromString("")
            else j
          )
          jsonObject.remove("ProductType__c").add("productType", existingValue.get)
        }
      }
    }
  }

  sealed trait Status

  case object Active extends Status

  case object Expired extends Status

  object Status {

    def fromString(s: String) = s.toLowerCase match {
      case "active" => Some(Active)
      case "expired" => Some(Expired)
      case _ => None
    }

  }

  case class ProductRatePlan(
    id: String,
    status: Status,
    name: Option[String],
    productRatePlanCharges: List[ProductRatePlanCharge]
  ) {
    def price: Double = {
      productRatePlanCharges
        .filter(_.endDateCondition.contains("Subscription_End"))
        .map(
          _.pricing
            .filter(_.currency == GBP)
            .map(_.price).sum
        ).sum
    }
  }

  case class Product(
    id: ProductId,
    name: String,
    productRatePlans: List[ProductRatePlan]
  )

  case class Catalog(
    products: List[Product]
  )

  case class PricePlan(
    id: String,
    name: Option[String],
    pricePerPeriod: List[Pricing]
  )


  case class PaperPrices(
    collection: List[PricePlan],
    delivery: List[PricePlan]
  )

  object PaperPrices {
    def empty: PaperPrices = PaperPrices(List.empty, List.empty)
  }

  sealed trait ProductRatePlanChargeType {
    val id: String
  }

  object ProductRatePlanChargeType {
    def fromId(id: String): Option[ProductRatePlanChargeType] = {
      PaperDay.fromId(id) orElse List(Digipack, Weekly, Adjustment, Contributor).find(_.id == id)
    }

    implicit val productRatePlanChargeTypeDecoder: Decoder[Option[ProductRatePlanChargeType]] = Decoder.decodeString.map(fromId)
  }

  case class PaperDay(id: String, dayOfWeek: DayOfWeek) extends ProductRatePlanChargeType

  object PaperDay {
    val printPattern = "Print\\s(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)".r

    def fromId(id: String) = id match {
      case printPattern(day) => Some(PaperDay(id, DayOfWeek.valueOf(day.toUpperCase)))
      case _ => None
    }

  }

  case object Digipack extends ProductRatePlanChargeType {
    override val id = "Digital Pack"
  }

  case object Weekly extends ProductRatePlanChargeType {
    override val id = "Guardian Weekly"
  }

  case object Contributor extends ProductRatePlanChargeType {
    override val id = "Contributor"
  }

  case object Adjustment extends ProductRatePlanChargeType {
    override val id = "Adjustment"
  }

  //Codecs

  implicit val decoder: Decoder[Status] = Decoder.decodeString.emap(status => Status.fromString(status).toRight(s"Unrecognized status '$status'"))

}
