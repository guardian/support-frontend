package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.PromoError
import com.gu.support.redemption.InvalidCode
import com.gu.support.workers.DigitalPack
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionBuilder.BuildResult
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.validateRatePlan

import scala.concurrent.{ExecutionContext, Future}

trait SubscriptionPaymentTypeBuilder {

  def build(
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    readerType: ReaderType,
  )(implicit ec: ExecutionContext): BuildResult

}

object DigitalSubscriptionBuilder {

  type BuildResult = EitherT[Future, Either[PromoError, InvalidCode], SubscriptionData]

  def build(
    subscriptionPaymentTypeBuilder: SubscriptionPaymentTypeBuilder,
    digitalPack: DigitalPack,
    requestId: UUID,
    environment: TouchPointEnvironment,
  )(implicit ec: ExecutionContext): BuildResult = {
    val productRatePlanId = validateRatePlan(digitalRatePlan(digitalPack, environment), digitalPack.describe)
    subscriptionPaymentTypeBuilder.build(productRatePlanId, requestId, digitalPack.readerType)
  }

}

class RedemptionErrorBuilder(invalidReaderType: InvalidCode) extends SubscriptionPaymentTypeBuilder {
  override def build(productRatePlanId: ProductRatePlanId, requestId: UUID, readerType: ReaderType)(implicit ec: ExecutionContext): BuildResult = {
    val errorType: Either[PromoError, InvalidCode] = Right(invalidReaderType)
    EitherT.leftT[Future, SubscriptionData](errorType)(catsStdInstancesForFuture(ec))
  }
}

