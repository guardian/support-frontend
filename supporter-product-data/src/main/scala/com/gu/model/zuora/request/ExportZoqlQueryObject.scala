package com.gu.model.zuora.request

import com.gu.model.FieldsToExport._
import com.gu.model.zuora.request.DynamoActionType.{Delete, Insert}
import io.circe.{Decoder, Encoder}

import java.time.LocalDate

sealed abstract class DynamoActionType

object DynamoActionType {
  case object Insert extends DynamoActionType

  case object Delete extends DynamoActionType
}

sealed abstract class ExportZoqlQueryObject(val name: String, val dynamoActionType: DynamoActionType) {
  def query(date: LocalDate): String
}

object ExportZoqlQueryObject {
  private val discountProductRatePlanId = "2c92c0f852f2ebb20152f9269f067819"

  case object SelectActiveRatePlans extends ExportZoqlQueryObject("active-rate-plans", Insert){
    def query(date: LocalDate): String =
      s"""SELECT
          ${identityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName}
            FROM
            rateplan
            WHERE
            ${identityId.zuoraName} != null AND
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            ${productRatePlanId.zuoraName} != '$discountProductRatePlanId' AND
            ${termEndDate.zuoraName} >= '$date'
    """
  }

  case object SelectRatePlansStartedOn extends ExportZoqlQueryObject("rate-plans-started", Insert) {
    def query(date: LocalDate): String =
      s"""SELECT
          ${identityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName}
            FROM
            rateplan
            WHERE
            ${identityId.zuoraName} != null AND
            Subscription.Status = 'Active' AND
            ProductRatePlan.Id != '$discountProductRatePlanId' AND
            Subscription.TermStartDate = '$date'
    """
  }

  case object SelectRatePlansCancelledOn extends ExportZoqlQueryObject("rate-plans-cancelled", Delete) {
    def query(date: LocalDate): String =
      s"""SELECT
          ${identityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName}
            FROM
            rateplan
            WHERE
            ${identityId.zuoraName} != null AND
            ProductRatePlan.Id != '$discountProductRatePlanId' AND
            Subscription.Status = 'Cancelled' AND
            Subscription.CancelledDate = '$date'"
    """
  }

  implicit val decoder: Decoder[ExportZoqlQueryObject] = Decoder.decodeString.emap(fromString)
  implicit val encoder: Encoder[ExportZoqlQueryObject] = Encoder.encodeString.contramap(_.name)

  def fromString(str: String): Either[String, ExportZoqlQueryObject] =
    List(SelectActiveRatePlans, SelectRatePlansStartedOn, SelectRatePlansCancelledOn)
      .find(_.name == str)
      .toRight(s"Unknown export zoql query $str")
}
