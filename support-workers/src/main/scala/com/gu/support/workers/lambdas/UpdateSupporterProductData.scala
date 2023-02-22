package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.helpers.SupportWorkersV2Helper.isV2SupporterPlus
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog._
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.lambdas.UpdateSupporterProductData.getSupporterRatePlanItemFromState
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailContributionState,
  SendThankYouEmailDigitalSubscriptionCorporateRedemptionState,
  SendThankYouEmailDigitalSubscriptionDirectPurchaseState,
  SendThankYouEmailDigitalSubscriptionGiftPurchaseState,
  SendThankYouEmailDigitalSubscriptionGiftRedemptionState,
  SendThankYouEmailGuardianWeeklyState,
  SendThankYouEmailPaperState,
  SendThankYouEmailSupporterPlusState,
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
    SafeLogger.info(s"Attempting to update user ${state.user.id}")
    getSupporterRatePlanItemFromState(state, catalogService) match {
      case Right(Some(supporterRatePlanItem)) =>
        SafeLogger.info(s"Attempting to write supporterRatePlanItem $supporterRatePlanItem")
        supporterDataDynamoService.writeItem(supporterRatePlanItem).map { _ =>
          SafeLogger.info(s"Successfully updated supporterRatePlanItem for user ${state.user.id}")
          ()
        }
      case Right(None) =>
        SafeLogger.info(
          s"Skipping write to SupporterProductData dynamo table because product is ${state.product.describe}",
        )
        Future.successful(())
      case Left(errMessage) =>
        Future.failed(
          new RuntimeException(
            s"Unable to update the SupporterProductData dynamo table because $errMessage",
          ),
        )
    }
  }

}

object UpdateSupporterProductData {

  def getSupporterRatePlanItemFromState(
      state: SendThankYouEmailState,
      catalogService: CatalogService,
  ): Either[String, Option[SupporterRatePlanItem]] =
    state match {
      case SendThankYouEmailContributionState(user, product, _, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(Contribution, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
                Some(ContributionAmount(product.amount, product.currency.iso)),
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")

      case SendThankYouEmailSupporterPlusState(user, product, _, _, subscriptionNumber, abTests) =>
        val supporterPlusVersion = if (isV2SupporterPlus(abTests)) SupporterPlusV2 else SupporterPlusV1
        catalogService
          .getProductRatePlan(SupporterPlus, product.billingPeriod, NoFulfilmentOptions, supporterPlusVersion)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
                Some(ContributionAmount(product.amount, product.currency.iso)),
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")

      case SendThankYouEmailDigitalSubscriptionDirectPurchaseState(user, product, _, _, _, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")

      case SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(user, product, _, subscriptionNumber) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions, Corporate)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")

      case SendThankYouEmailDigitalSubscriptionGiftRedemptionState(user, product, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(DigitalPack, product.billingPeriod, NoFulfilmentOptions, NoProductOptions, Gift)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")
      case SendThankYouEmailDigitalSubscriptionGiftPurchaseState(_, _, _, _, _, _, _, _, _, _, _) =>
        Right(
          None,
        ) // We don't want to write DS gift purchases to the data store because they don't give the purchaser DS benefits
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
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}-$readerType",
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")
      case SendThankYouEmailPaperState(user, product, _, _, _, _, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(Paper, product.billingPeriod, product.fulfilmentOptions, product.productOptions)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")
      case _ => Left(s"Unknown product in state: $state")
    }

  private def supporterRatePlanItem(
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
