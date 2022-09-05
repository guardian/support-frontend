package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.supporterdata
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog._
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.lambdas.UpdateSupporterProductData.getSupporterRatePlanItemFromState
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailContributionState,
  SendThankYouEmailDigitalSubscriptionCorporateRedemptionState,
  SendThankYouEmailDigitalSubscriptionDirectPurchaseState,
  SendThankYouEmailDigitalSubscriptionGiftRedemptionState,
  SendThankYouEmailGuardianWeeklyState,
  SendThankYouEmailPaperState,
}
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.zuora.api.ReaderType.{Corporate, Direct, Gift}
import com.gu.supporterdata.model.{ContributionAmount, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.threadpools.CustomPool.executionContext

import java.time.LocalDate
import scala.concurrent.Future

class UpdateSupporterProductData(serviceProvider: ServiceProvider)
    extends SubsetServicesHandler[SendAcquisitionEventState, Unit, SendThankYouEmailState](
      serviceProvider,
      _.sendThankYouEmailState,
    ) {

  def this() = this(ServiceProvider)

  override protected def subsetHandler(
      state: SendThankYouEmailState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): FutureHandlerResult =
    updateSupporterProductData(state, services.catalogService, services.supporterDataDynamoService)
      .map(_ => HandlerResult((), requestInfo))

  def updateSupporterProductData(
      state: SendThankYouEmailState,
      catalogService: CatalogService,
      supporterDataDynamoService: SupporterDataDynamoService,
  ) = {
    getSupporterRatePlanItemFromState(state, catalogService) match {
      case Right(Some(supporterRatePlanItem)) =>
        supporterDataDynamoService.writeItem(supporterRatePlanItem).map(_ => ())
      case Right(None) => Future.successful(())
      case Left(_) =>
        Future.failed(
          new RuntimeException(
            s"Unable to update the SupporterProductData dynamo table because we couldn't create a SupporterRatePlanItem from state: $state",
          ),
        )
    }
  }

}

object UpdateSupporterProductData {

  def getSupporterRatePlanItemFromState(
      state: SendThankYouEmailState,
      catalogService: CatalogService,
  ): Either[Unit, Option[SupporterRatePlanItem]] =
    state match {
      case SendThankYouEmailContributionState(user, product, _, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(Contribution, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            supporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.describe}",
              Some(ContributionAmount(product.amount, product.currency.iso)),
            ),
          )
          .toRight(())
          .map(Some(_))
      case SendThankYouEmailDigitalSubscriptionDirectPurchaseState(user, product, _, _, _, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            supporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.describe}",
            ),
          )
          .toRight(())
          .map(Some(_))
      case SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(user, product, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions, Corporate)
          .map(productRatePlan =>
            supporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.describe}",
            ),
          )
          .toRight(())
          .map(Some(_))
      case SendThankYouEmailDigitalSubscriptionGiftRedemptionState(user, product, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions, Gift)
          .map(productRatePlan =>
            supporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.describe}",
            ),
          )
          .toRight(())
          .map(Some(_))
      case SendThankYouEmailGuardianWeeklyState(user, product, giftRecipient, _, _, _, _, subscriptionNumber, _) =>
        val readerType = if (giftRecipient.isDefined) Gift else Direct
        catalogService
          .getProductRatePlan(
            GuardianWeekly,
            product.billingPeriod,
            product.fulfilmentOptions,
            NoProductOptions,
            readerType,
          )
          .map(productRatePlan =>
            supporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.describe}-$readerType",
            ),
          )
          .toRight(())
          .map(Some(_))
      case SendThankYouEmailPaperState(user, product, _, _, _, _, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(Paper, product.billingPeriod, product.fulfilmentOptions, product.productOptions)
          .map(productRatePlan =>
            supporterRatePlanItem(
              subscriptionName = subscriptionNumber,
              identityId = user.id,
              productRatePlanId = productRatePlan.id,
              productRatePlanName = s"support-workers added ${product.describe}",
            ),
          )
          .toRight(())
          .map(Some(_))
      case _ => Right(None)
    }

  def supporterRatePlanItem(
      subscriptionName: String,
      identityId: String,
      productRatePlanId: String,
      productRatePlanName: String,
      contributionAmount: Option[ContributionAmount] = None,
  ) =
    SupporterRatePlanItem(
      subscriptionName = subscriptionName,
      identityId = identityId,
      gifteeIdentityId = None,
      productRatePlanId = productRatePlanId,
      productRatePlanName = productRatePlanName,
      termEndDate = LocalDate.now.plusWeeks(1),
      contractEffectiveDate = LocalDate.now,
      contributionAmount,
    )
}
