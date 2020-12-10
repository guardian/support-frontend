package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{Contribution, DigitalPack, GuardianWeekly, Paper, PaymentMethod, RequestInfo}
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
import com.gu.support.zuora.api.ReaderType

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateSalesforceContact extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState](ServiceProvider) {

  override protected def servicesHandler(
    state: CreateSalesforceContactState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): Future[HandlerResult[CreateZuoraSubscriptionState]] = {
    SafeLogger.debug(s"CreateSalesforceContact state: $state")

    services.salesforceService.createContactRecords(state.user, state.giftRecipient).flatMap { response =>
      if (response.successful) {
        Future.successful(HandlerResult(new NextZuoraState(state, response.contactRecords).getZuoraState(), requestInfo))
      } else {
        val errorMessage = response.errorMessage.getOrElse("No error message returned")
        SafeLogger.warn(s"Error creating Salesforce contact:\n$errorMessage")
        Future.failed(new SalesforceException(errorMessage))
      }
    }
  }

}

class NextZuoraState(
  state: CreateSalesforceContactState,
  salesforceContactRecords: SalesforceContactRecords,
) {

  val Purchase = Left
  type Redemption = Right[PaymentMethod, RedemptionData]

  // scalastyle:off cyclomatic.complexity
  def getZuoraState(): CreateZuoraSubscriptionState =
    (state.product, state.paymentMethod) match {
      case (product: Contribution, Purchase(purchase)) =>
        state.toNextContribution(salesforceContactRecords, product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Direct =>
        state.toNextDSDirect(salesforceContactRecords.buyer, product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Gift =>
        state.toNextDSGift(salesforceContactRecords, product, purchase)
      case (product: Paper, Purchase(purchase)) =>
        state.toNextPaper(salesforceContactRecords.buyer, product, purchase)
      case (product: GuardianWeekly, Purchase(purchase)) =>
        state.toNextWeekly(salesforceContactRecords, product, purchase)
      case (product: DigitalPack, redemptionData: Redemption) if product.readerType == ReaderType.Corporate =>
        state.toNextDSCorporate(salesforceContactRecords.buyer, product, redemptionData.value)
      case (product: DigitalPack, redemptionData: Redemption) if product.readerType == ReaderType.Gift =>
        state.toNextDSRedemption(product, redemptionData.value)
      case _ => throw new RuntimeException("could not create value state")
    }
  // scalastyle:on cyclomatic.complexity

}
