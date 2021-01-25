package com.gu.model.zuora.request

import com.gu.model.FieldsToExport._
import io.circe.Decoder

import java.time.LocalDate

abstract class ExportZoqlQueryObject(val name: String) {
  def query(date: LocalDate): String
}

object ExportZoqlQueryObject {
  private val discountProductRatePlanId = "2c92c0f852f2ebb20152f9269f067819"

  case object SelectActiveRatePlans extends ExportZoqlQueryObject("active-rate-plans"){
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
            ${termEndDate.zuoraName} >= '$date'
    """
  }

  case object SelectRatePlansStartedOn extends ExportZoqlQueryObject("rate-plans-started") {
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

  case object SelectRatePlansCancelledOn extends ExportZoqlQueryObject("rate-plans-cancelled") {
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
            RatePlan.AmendmentType = 'Cancellation' AND
            RatePlan.UpdatedDate = '$date'"
    """
  }

  implicit val decoder: Decoder[ExportZoqlQueryObject] = Decoder.decodeString.emap(fromString)

  def fromString(str: String): Either[String, ExportZoqlQueryObject] =
    List(SelectActiveRatePlans, SelectRatePlansStartedOn, SelectRatePlansCancelledOn)
      .find(_.name == str)
      .toRight(s"Unknown export zoql query $str")
}
