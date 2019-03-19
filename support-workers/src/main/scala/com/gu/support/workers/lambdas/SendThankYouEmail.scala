package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.emailservices.{ContributionEmailFields, DigitalPackEmailFields, EmailService, PaperEmailFields}
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog.{Collection, HomeDelivery}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers._
import com.gu.support.workers.states.{DirectDebitEmailPaymentFields, EmailPaymentFields, SendThankYouEmailState}
import com.gu.threadpools.CustomPool.executionContext
import com.gu.zuora.ZuoraService
import io.circe.generic.auto._
import org.joda.time.DateTime

import scala.concurrent.Future

class SendThankYouEmail(thankYouEmailService: EmailService, servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendThankYouEmailState, SendMessageResult](servicesProvider) {

  def this() = this(new EmailService)

  override protected def servicesHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    def completePaymentMethod(state: SendThankYouEmailState): Future[SendThankYouEmailState] = state.paymentMethod match {
      case ddFields: DirectDebitEmailPaymentFields => addMandateIdIfNeeded(ddFields).map(ddFieldsWithMandateId => state.copy(paymentMethod = ddFieldsWithMandateId))
      case otherPaymentMethod => Future.successful(state)
    }

    def addMandateIdIfNeeded(directDebitFields: DirectDebitEmailPaymentFields): Future[DirectDebitEmailPaymentFields] = {
      directDebitFields.mandateId match {
        case Some(mandateId) => Future.successful(directDebitFields)
        case None => fetchDirectDebitMandateId(state, services.zuoraService).map { fetchedMandateId =>
          directDebitFields.copy(mandateId = fetchedMandateId)
        }
      }
    }

    for {
      stateWithMandateId <- completePaymentMethod(state)
      emailResult <- sendEmail(stateWithMandateId)
    } yield HandlerResult(emailResult, requestInfo)

  }


  def fetchDirectDebitMandateId(state: SendThankYouEmailState, zuoraService: ZuoraService): Future[Option[String]] = state.paymentMethod match {
    case _: DirectDebitPaymentMethod =>
      zuoraService.getMandateIdFromAccountNumber(state.accountNumber)
    case _ => Future.successful(None)
  }

  def sendEmail(state: SendThankYouEmailState, directDebitMandateId: Option[String] = None): Future[SendMessageResult] =
    thankYouEmailService.send(
      state.product match {
        case c: Contribution => ContributionEmailFields(
          email = state.user.primaryEmailAddress,
          created = DateTime.now(),
          amount = c.amount,
          currency = c.currency,
          edition = state.user.billingAddress.country.alpha2,
          name = state.user.firstName,
          billingPeriod = state.product.billingPeriod,
          sfContactId = SfContactId(state.salesForceContact.Id),
          paymentMethod = state.paymentMethod,
        )
        case d: DigitalPack => DigitalPackEmailFields(
          subscriptionNumber = state.subscriptionNumber,
          billingPeriod = d.billingPeriod,
          user = state.user,
          paymentSchedule = state.paymentSchedule,
          currency = d.currency,
          paymentMethod = state.paymentMethod,
          sfContactId = SfContactId(state.salesForceContact.Id)
        )
        case p: Paper => PaperEmailFields(
          subscriptionNumber = state.subscriptionNumber,
          fulfilmentOptions = p.fulfilmentOptions,
          productOptions = p.productOptions,
          billingPeriod = p.billingPeriod,
          user = state.user,
          paymentSchedule = state.paymentSchedule,
          firstDeliveryDate = state.firstDeliveryDate,
          currency = p.currency,
          paymentMethod = state.paymentMethod,
          sfContactId = SfContactId(state.salesForceContact.Id)
        )
      }
    )

}
