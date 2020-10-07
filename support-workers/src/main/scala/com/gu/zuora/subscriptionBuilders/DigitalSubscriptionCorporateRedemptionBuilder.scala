package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.redemption.corporate.CorporateCodeValidator
import com.gu.support.redemption.{InvalidCode, InvalidReaderType, ValidCorporateCode}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Corporate
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionBuilder.BuildResult
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.buildProductSubscription
import org.joda.time.LocalDate

import scala.concurrent.ExecutionContext

class DigitalSubscriptionCorporateRedemptionBuilder(
  codeValidator: CorporateCodeValidator,
  today: () => LocalDate,
) {

  class WithRedemption(redemptionData: RedemptionData) extends SubscriptionPaymentTypeBuilder {

    def build(
      productRatePlanId: ProductRatePlanId,
      requestId: UUID,
      readerType: ReaderType,
    )(implicit ec: ExecutionContext): BuildResult = {
      val redemptionCode = redemptionData.redemptionCode
      val todaysDate = today()
      val subscriptionData = buildProductSubscription(
        requestId,
        productRatePlanId,
        contractAcceptanceDate = todaysDate,
        contractEffectiveDate = todaysDate,
        readerType = Corporate
      )

      val redeemedSubcription = for {
        subscription <-
          EitherT(codeValidator.getStatus(redemptionCode).map {
            case ValidCorporateCode(corporateId) =>
              Right(subscriptionData.subscription.copy(
                redemptionCode = Some(redemptionCode.value),
                corporateAccountId = Some(corporateId.corporateIdString),
                readerType = ReaderType.Corporate
              ))
            case error: InvalidCode => Left(error)
            case _ => Left(InvalidReaderType)
          })
      } yield subscription

      redeemedSubcription
        .map(subscription => subscriptionData.copy(subscription = subscription))
        .leftMap(Right.apply)
    }

  }

}
