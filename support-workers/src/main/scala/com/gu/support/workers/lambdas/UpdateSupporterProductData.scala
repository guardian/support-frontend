package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.supporterdata
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog._
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.states.SendThankYouEmailState.{SendThankYouEmailContributionState, SendThankYouEmailDigitalSubscriptionCorporateRedemptionState, SendThankYouEmailDigitalSubscriptionDirectPurchaseState, SendThankYouEmailDigitalSubscriptionGiftRedemptionState, SendThankYouEmailGuardianWeeklyState, SendThankYouEmailPaperState}
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.supporterdata.model.SupporterRatePlanItem
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.threadpools.CustomPool.executionContext

import java.time.LocalDate
import scala.concurrent.Future

class UpdateSupporterProductData(serviceProvider: ServiceProvider)
  extends SubsetServicesHandler[SendAcquisitionEventState, Unit, SendThankYouEmailState](
    serviceProvider,
    _.sendThankYouEmailState
  ) {

  def this() = this(ServiceProvider)

  override protected def subsetHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult =
    updateSupporterProductData(state, services.catalogService, services.supporterDataDynamoService)
      .map(_ => HandlerResult((), requestInfo))

  def updateSupporterProductData(
    state: SendThankYouEmailState,
    catalogService: CatalogService,
    supporterDataDynamoService: SupporterDataDynamoService
  ) = {
    getSupporterRatePlanItemFromState(state, catalogService) match {
      case Some(supporterRatePlanItem) => supporterDataDynamoService.writeItem(supporterRatePlanItem)
      case None => Future.failed(
          new RuntimeException(s"Unable to update the SupporterProductData dynamo table because we couldn't create a SupporterRatePlanItem from state: $state")
        )
    }

  }

  def getSupporterRatePlanItemFromState(state: SendThankYouEmailState, catalogService: CatalogService): Option[SupporterRatePlanItem] =
    state match {
      case SendThankYouEmailContributionState(user, product, _, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(Contribution, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            supporterdata.model.SupporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              gifteeIdentityId = None,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = "support-workers added Contribution",
              termEndDate = LocalDate.now.plusYears(1),
              contractEffectiveDate = LocalDate.now
            ))
      case SendThankYouEmailDigitalSubscriptionDirectPurchaseState(user, product, _, _, _, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            supporterdata.model.SupporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              gifteeIdentityId = None,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = "support-workers added Digital Subscription",
              termEndDate = LocalDate.now.plusYears(1),
              contractEffectiveDate = LocalDate.now
            ))
      case SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(user, product, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            supporterdata.model.SupporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              gifteeIdentityId = None,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = "support-workers added Gift Digital Subscription",
              termEndDate = LocalDate.now.plusYears(1),
              contractEffectiveDate = LocalDate.now
            ))
      case SendThankYouEmailDigitalSubscriptionGiftRedemptionState(user, product, _) => None // TODO need a subscription number here
      case SendThankYouEmailGuardianWeeklyState(user, product, _, _, _, _, _, subscriptionNumber, _) =>
        // TODO do we care that for a GW gifter, the product is not actually theirs?
        catalogService
          .getProductRatePlan(GuardianWeekly, product.billingPeriod, product.fulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            supporterdata.model.SupporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              gifteeIdentityId = None,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = "support-workers added Guardian Weekly",
              termEndDate = LocalDate.now.plusYears(1),
              contractEffectiveDate = LocalDate.now
            ))
      case SendThankYouEmailPaperState(user, product, _, _, _, _, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(Paper, product.billingPeriod, product.fulfilmentOptions, product.productOptions)
          .map(productRatePlan =>
            supporterdata.model.SupporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              gifteeIdentityId = None,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.productOptions.toString}",
              termEndDate = LocalDate.now.plusYears(1),
              contractEffectiveDate = LocalDate.now
            ))
      case _ => None
    }
}
