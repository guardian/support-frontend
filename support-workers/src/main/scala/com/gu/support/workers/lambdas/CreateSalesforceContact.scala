package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{
  Contribution,
  DigitalPack,
  GuardianWeekly,
  Paper,
  PaymentMethod,
  RequestInfo,
  SalesforceContactRecord,
  SupporterPlus,
}
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{
  ContributionState,
  DigitalSubscriptionCorporateRedemptionState,
  DigitalSubscriptionDirectPurchaseState,
  DigitalSubscriptionGiftPurchaseState,
  DigitalSubscriptionGiftRedemptionState,
  GuardianWeeklyState,
  PaperState,
  SupporterPlusState,
}
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
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
    SafeLogger.debug(s"CreateSalesforceContact state: $state")

    services.salesforceService.createContactRecords(state.user, state.giftRecipient).flatMap { response =>
      if (response.successful) {
        Future.successful(HandlerResult(new NextState(state).build(response.contactRecords), requestInfo))
      } else {
        val errorMessage = response.errorMessage.getOrElse("No error message returned")
        SafeLogger.warn(s"Error creating Salesforce contact:\n$errorMessage")
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
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Direct =>
        toNextDSDirect(salesforceContactRecords.buyer, product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Gift =>
        toNextDSGift(salesforceContactRecords, product, purchase)
      case (product: Paper, Purchase(purchase)) =>
        toNextPaper(salesforceContactRecords.buyer, product, purchase)
      case (product: GuardianWeekly, Purchase(purchase)) =>
        toNextWeekly(salesforceContactRecords, product, purchase)
      case (product: DigitalPack, redemptionData: Redemption) if product.readerType == ReaderType.Corporate =>
        toNextDSCorporate(salesforceContactRecords.buyer, product, redemptionData.value)
      case (product: DigitalPack, redemptionData: Redemption) if product.readerType == ReaderType.Gift =>
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

  def toNextDSCorporate(
      salesforceContactRecord: SalesforceContactRecord,
      product: DigitalPack,
      redemptionData: RedemptionData,
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionCorporateRedemptionState(
        product,
        redemptionData,
        salesforceContactRecord,
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
        promoCode,
        salesforceContactRecords,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      promoCode,
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
        promoCode,
        salesforceContactRecord,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      promoCode,
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
        promoCode,
        salesforceContactRecords,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      promoCode,
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
        promoCode,
        salesforceContactRecord,
      ),
      requestId,
      user,
      product,
      analyticsInfo,
      firstDeliveryDate,
      promoCode,
      state.csrUsername,
      state.salesforceCaseId,
      acquisitionData,
    )

}
