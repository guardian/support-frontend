package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{
  ContributionState,
  DigitalSubscriptionDirectPurchaseState,
  DigitalSubscriptionGiftPurchaseState,
  DigitalSubscriptionGiftRedemptionState,
  GuardianAdLiteState,
  GuardianWeeklyState,
  PaperState,
  SupporterPlusState,
  TierThreeState,
}
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateSalesforceContact
    extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState](ServiceProvider) {

  override protected def servicesHandler(
      state: CreateSalesforceContactState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): Future[HandlerResult[CreateZuoraSubscriptionState]] = {
    logger.debug(s"CreateSalesforceContact state: $state")

    services.salesforceService.createContactRecords(state.user, state.giftRecipient).flatMap { response =>
      if (response.successful) {
        Future.successful(HandlerResult(new NextState(state).build(response.contactRecords), requestInfo))
      } else {
        val errorMessage = response.errorMessage.getOrElse("No error message returned")
        logger.warn(s"Error creating Salesforce contact:\n$errorMessage")
        Future.failed(new SalesforceException(errorMessage))
      }
    }
  }

}
class NextState(state: CreateSalesforceContactState) {

  import state._

  val Purchase = Left
  type Redemption = Right[PaymentMethod, RedemptionData]

  // scalastyle:off cyclomatic.complexity
  def build(
      salesforceContactRecords: SalesforceContactRecords,
  ): CreateZuoraSubscriptionState =
    (product, paymentMethod) match {
      case (product: Contribution, Purchase(purchase)) =>
        toNextContribution(salesforceContactRecords, product, purchase)
      case (product: SupporterPlus, Purchase(purchase)) =>
        toNextSupporterPlus(salesforceContactRecords, product, purchase)
      case (product: TierThree, Purchase(purchase)) =>
        toNextTierThree(salesforceContactRecords, product, purchase)
      case (product: GuardianAdLite, Purchase(purchase)) =>
        toNextGuardianLight(salesforceContactRecords, product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Direct =>
        toNextDSDirect(salesforceContactRecords.buyer, product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Gift =>
        toNextDSGift(salesforceContactRecords, product, purchase)
      case (product: Paper, Purchase(purchase)) =>
        toNextPaper(salesforceContactRecords.buyer, product, purchase)
      case (product: GuardianWeekly, Purchase(purchase)) =>
        toNextWeekly(salesforceContactRecords, product, purchase)
      case (product: DigitalPack, redemptionData: Redemption) =>
        toNextDSRedemption(product, redemptionData.value)
      case _ => throw new RuntimeException("could not create value state")
    }
  // scalastyle:on cyclomatic.complexity

  def toNextContribution(
      salesforceContactRecords: SalesforceContactRecords,
      product: Contribution,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      ContributionState(
        product,
        purchase,
        salesforceContactRecords.buyer,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      None,
      None,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextSupporterPlus(
      salesforceContactRecords: SalesforceContactRecords,
      product: SupporterPlus,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      SupporterPlusState(
        user.billingAddress.country,
        product,
        purchase,
        appliedPromotion,
        salesforceContactRecords.buyer,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      None,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextTierThree(
      salesforceContactRecords: SalesforceContactRecords,
      product: TierThree,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      TierThreeState(
        user,
        product,
        purchase,
        firstDeliveryDate.get,
        appliedPromotion,
        salesforceContactRecords.buyer,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextGuardianLight(
      salesforceContactRecords: SalesforceContactRecords,
      product: GuardianAdLite,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      GuardianAdLiteState(
        product,
        purchase,
        salesforceContactRecords.buyer,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextDSRedemption(
      product: DigitalPack,
      redemptionData: RedemptionData,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionGiftRedemptionState(
        user.id,
        product,
        redemptionData,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      None,
      None,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )
  def toNextWeekly(
      salesforceContactRecords: SalesforceContactRecords,
      product: GuardianWeekly,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      GuardianWeeklyState(
        user,
        giftRecipient.map(_.asWeekly.get),
        product,
        purchase,
        firstDeliveryDate.get,
        appliedPromotion,
        salesforceContactRecords,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextPaper(
      salesforceContactRecord: SalesforceContactRecord,
      product: Paper,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      PaperState(
        user,
        product,
        purchase,
        firstDeliveryDate.get,
        appliedPromotion,
        salesforceContactRecord,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextDSGift(
      salesforceContactRecords: SalesforceContactRecords,
      product: DigitalPack,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionGiftPurchaseState(
        user.billingAddress.country,
        giftRecipient.flatMap(_.asDigitalSubscriptionGiftRecipient).get,
        product,
        purchase,
        appliedPromotion,
        salesforceContactRecords,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

  def toNextDSDirect(
      salesforceContactRecord: SalesforceContactRecord,
      product: DigitalPack,
      purchase: PaymentMethod,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionDirectPurchaseState(
        user.billingAddress.country,
        product,
        purchase,
        appliedPromotion,
        salesforceContactRecord,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

}
