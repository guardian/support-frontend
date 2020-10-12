package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.redemption.corporate.CorporateCodeValidator
import com.gu.support.redemption.{InvalidCode, InvalidReaderType, ValidCorporateCode}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.DigitalPack
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.zuora.api.ReaderType.Corporate
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{buildProductSubscription, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

class DigitalSubscriptionCorporateRedemptionBuilder(
  codeValidator: CorporateCodeValidator,
  today: () => LocalDate,
) {

  def build(
    redemptionData: RedemptionData,
    digitalPack: DigitalPack,
    requestId: UUID,
    environment: TouchPointEnvironment,
  )(implicit ec: ExecutionContext): EitherT[Future, InvalidCode, SubscriptionData] = {
    val productRatePlanId = validateRatePlan(digitalRatePlan(digitalPack, environment), digitalPack.describe)
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
  }

}
