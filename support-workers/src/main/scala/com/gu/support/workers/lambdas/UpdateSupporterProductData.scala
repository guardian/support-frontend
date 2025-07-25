package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog._
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.lambdas.UpdateSupporterProductData.getSupporterRatePlanItemFromState
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailContributionState,
  SendThankYouEmailDigitalSubscriptionState,
  SendThankYouEmailGuardianAdLiteState,
  SendThankYouEmailGuardianWeeklyState,
  SendThankYouEmailPaperState,
  SendThankYouEmailSupporterPlusState,
  SendThankYouEmailTierThreeState,
}
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
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
    logger.info(s"Attempting to update user ${state.user.id}")
    getSupporterRatePlanItemFromState(state, catalogService) match {
      case Right(Some(supporterRatePlanItem)) =>
        logger.info(s"Attempting to write supporterRatePlanItem $supporterRatePlanItem")
        supporterDataDynamoService.writeItem(supporterRatePlanItem).map { _ =>
          logger.info(s"Successfully updated supporterRatePlanItem for user ${state.user.id}")
          ()
        }
      case Right(None) =>
        logger.info(
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
      case SendThankYouEmailContributionState(user, product, _, _, _, subscriptionNumber, _) =>
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

      case SendThankYouEmailSupporterPlusState(user, product, _, _, _, _, _, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(SupporterPlus, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
                None, // We don't send the amount for S+, because it may be discounted
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")

      case SendThankYouEmailTierThreeState(user, product, _, _, _, _, _, subscriptionNumber, _, _) =>
        catalogService
          .getProductRatePlan(TierThree, product.billingPeriod, product.fulfilmentOptions, product.productOptions)
          .map(productRatePlan =>
            Some(
              supporterRatePlanItem(
                subscriptionName = subscriptionNumber,
                identityId = user.id,
                productRatePlanId = productRatePlan.id,
                productRatePlanName = s"support-workers added ${product.describe}",
                None,
              ),
            ),
          )
          .toRight(s"Unable to create SupporterRatePlanItem from state $state")

      case SendThankYouEmailDigitalSubscriptionState(user, product, _, _, _, _, _, subscriptionNumber, _) =>
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
      case SendThankYouEmailGuardianWeeklyState(
            user,
            product,
            _,
            giftRecipient,
            _,
            _,
            _,
            _,
            subscriptionNumber,
            _,
            _,
          ) =>
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
      case SendThankYouEmailPaperState(user, product, _, _, _, _, _, subscriptionNumber, _, _) =>
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
      case SendThankYouEmailGuardianAdLiteState(user, product, _, _, _, _, subscriptionNumber, _) =>
        catalogService
          .getProductRatePlan(GuardianAdLite, product.billingPeriod, NoFulfilmentOptions, NoProductOptions)
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
      productRatePlanId = productRatePlanId,
      productRatePlanName = productRatePlanName,
      termEndDate = LocalDate.now.plusWeeks(1),
      contractEffectiveDate = LocalDate.now,
      contributionAmount,
    )
}
