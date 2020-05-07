package com.gu.support.workers.lambdas

import java.util.UUID

import com.amazonaws.services.lambda.runtime.Context
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client, paymentSuccessRequest}
import com.gu.config.Configuration
import com.gu.i18n.Country
import com.gu.monitoring.{LambdaExecutionResult, PaymentProvider, SafeLogger, Success}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog.{GuardianWeekly, Contribution => _, DigitalPack => _, Paper => _, _}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.workers._
import com.gu.support.workers.states.SendAcquisitionEventState
import io.circe.generic.auto._
import ophan.thrift.event.{PrintOptions, PrintProduct, Product => OphanProduct}
import ophan.thrift.{event => thrift}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class SendAcquisitionEvent(serviceProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[SendAcquisitionEventState, Unit](serviceProvider) {

  import SendAcquisitionEvent._
  import cats.instances.future._

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: SendAcquisitionEventState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    SafeLogger.info(s"Sending acquisition event to ophan: ${state.toString}")

    // Log the result of this execution to Elasticsearch
    LambdaExecutionResult.logResult(
      LambdaExecutionResult(
        state.requestId,
        Success,
        state.user.isTestUser,
        state.product,
        state.paymentMethod.map(PaymentProvider.fromPaymentMethod),
        state.firstDeliveryDate,
        state.giftRecipient.isDefined,
        state.promoCode,
        state.user.billingAddress.country,
        state.user.deliveryAddress.map(_.country),
        None,
        None
      )
    )

    // Throw any error in the EitherT monad so that in can be processed by ErrorHandler.handleException
    val result: Future[HandlerResult[Unit]] = services.acquisitionService.submit(
      SendAcquisitionEventStateAndRequestInfo(state, requestInfo)
    ).fold(
      errors => throw AnalyticsServiceErrorList(errors),
      _ => HandlerResult((), requestInfo)
    )

    val cloudwatchEvent = paymentSuccessRequest(Configuration.stage, state.paymentMethod.toOption.map(paymentProviderFromPaymentMethod), state.product)
    AwsCloudWatchMetricPut(client)(cloudwatchEvent)

    result
  }
}

case class SendAcquisitionEventStateAndRequestInfo(
  state: SendAcquisitionEventState,
  requestInfo: RequestInfo
)

object SendAcquisitionEvent {

  case class AnalyticsServiceErrorList(errors: List[AnalyticsServiceError]) extends Throwable {
    override def getMessage: String = errors.map(_.getMessage).mkString(". ")
  }

  def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod): thrift.PaymentProvider =
    paymentMethod match {
      case creditCardPayment: CreditCardReferenceTransaction =>
        creditCardPayment.stripePaymentType match {
          case Some(StripePaymentType.StripeApplePay) => thrift.PaymentProvider.StripeApplePay
          case Some(StripePaymentType.StripePaymentRequestButton) => thrift.PaymentProvider.StripePaymentRequestButton
          case _ => thrift.PaymentProvider.Stripe
        }
      case _: PayPalReferenceTransaction => thrift.PaymentProvider.Paypal
      case _: DirectDebitPaymentMethod | _: ClonedDirectDebitPaymentMethod => thrift.PaymentProvider.Gocardless
    }

  // Typeclass instance used by the Ophan service to attempt to build a submission from the state.
  private implicit val stateAcquisitionSubmissionBuilder: AcquisitionSubmissionBuilder[SendAcquisitionEventStateAndRequestInfo] =

    new AcquisitionSubmissionBuilder[SendAcquisitionEventStateAndRequestInfo] {

      import cats.syntax.either._

      override def buildOphanIds(stateAndInfo: SendAcquisitionEventStateAndRequestInfo): Either[String, OphanIds] =
        Either.fromOption(stateAndInfo.state.acquisitionData.map(_.ophanIds), "acquisition data not included")

      override def buildGAData(stateAndInfo: SendAcquisitionEventStateAndRequestInfo): Either[String, GAData] = {
        for {
          acquisitionData <- Either.fromOption(stateAndInfo.state.acquisitionData, "acquisition data not included")
          ref = acquisitionData.referrerAcquisitionData
          hostname <- Either.fromOption(ref.hostname, "missing hostname in referrer acquisition data")
          gaClientId = ref.gaClientId.getOrElse(UUID.randomUUID().toString)
          ipAddress = ref.ipAddress
          userAgent = ref.userAgent
        } yield GAData(
          hostname = hostname,
          clientId = gaClientId,
          clientIpAddress = ipAddress,
          clientUserAgent = userAgent
        )
      }

      def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod): thrift.PaymentFrequency =
      // object BillingObject extends the BillingObject trait.
      // Don't match on this as its not a valid billing period.
        (billingPeriod: @unchecked) match {
          case Monthly => thrift.PaymentFrequency.Monthly
          case Quarterly | SixWeekly => thrift.PaymentFrequency.Quarterly
          case Annual => thrift.PaymentFrequency.Annually
        }

      def printOptionsFromProduct(product: ProductType, deliveryCountry: Option[Country]): Option[PrintOptions] = {

        def printProduct(fulfilmentOptions: FulfilmentOptions, productOptions: ProductOptions): PrintProduct = {
          (fulfilmentOptions, productOptions) match {
            case (HomeDelivery, Everyday) => PrintProduct.HomeDeliveryEveryday
            case (HomeDelivery, Sixday) => PrintProduct.HomeDeliverySixday
            case (HomeDelivery, Weekend) => PrintProduct.HomeDeliveryWeekend
            case (HomeDelivery, Saturday) => PrintProduct.HomeDeliverySaturday
            case (HomeDelivery, Sunday) => PrintProduct.HomeDeliverySunday
            case (Collection, Everyday) => PrintProduct.VoucherEveryday
            case (Collection, Sixday) => PrintProduct.VoucherSixday
            case (Collection, Weekend) => PrintProduct.VoucherWeekend
            case (Collection, Saturday) => PrintProduct.VoucherSaturday
            case _ => PrintProduct.VoucherSunday
          }
        }

        product match {
          case p: Paper => Some(PrintOptions(printProduct(p.fulfilmentOptions, p.productOptions), "GB"))
          case _: GuardianWeekly => Some(PrintOptions(PrintProduct.GuardianWeekly, deliveryCountry.map(_.alpha2).getOrElse("")))
          case _ => None
        }
      }

      override def buildAcquisition(stateAndInfo: SendAcquisitionEventStateAndRequestInfo): Either[String, thrift.Acquisition] = {
        val (productType, productAmount) = stateAndInfo.state.product match {
          case c: Contribution => (OphanProduct.RecurringContribution, c.amount.toDouble)
          case _: DigitalPack => (OphanProduct.DigitalSubscription, 0D) //TODO: Send the real amount in the acquisition event
          case _: Paper => (OphanProduct.PrintSubscription, 0D) //TODO: same as above
          case _: GuardianWeekly => (OphanProduct.PrintSubscription, 0D) //TODO: same as above
        }

        Either.fromOption(
          stateAndInfo.state.acquisitionData.map { data =>
            thrift.Acquisition(
              product = productType,
              printOptions = printOptionsFromProduct(stateAndInfo.state.product, stateAndInfo.state.user.deliveryAddress.map(_.country)),
              paymentFrequency = paymentFrequencyFromBillingPeriod(stateAndInfo.state.product.billingPeriod),
              currency = stateAndInfo.state.product.currency.iso,
              amount = productAmount,
              paymentProvider = stateAndInfo.state.paymentMethod.map(paymentProviderFromPaymentMethod).toOption,
              // Currently only passing through at most one campaign code
              campaignCode = data.referrerAcquisitionData.campaignCode.map(Set(_)),
              abTests = Some(thrift.AbTestInfo(
                data.supportAbTests ++ data.referrerAcquisitionData.abTests.getOrElse(Set())
              )),
              countryCode = Some(stateAndInfo.state.user.billingAddress.country.alpha2),
              referrerPageViewId = data.referrerAcquisitionData.referrerPageviewId,
              referrerUrl = data.referrerAcquisitionData.referrerUrl,
              componentId = data.referrerAcquisitionData.componentId,
              componentTypeV2 = data.referrerAcquisitionData.componentType,
              source = data.referrerAcquisitionData.source,
              platform = Some(ophan.thrift.event.Platform.Support),
              queryParameters = data.referrerAcquisitionData.queryParameters,
              identityId = Some(stateAndInfo.state.user.id),
              labels = buildLabels(stateAndInfo)
            )
          },
          "acquisition data not included"
        )
      }

      def buildLabels(stateAndInfo: SendAcquisitionEventStateAndRequestInfo) =
        Some(Set(
          if (stateAndInfo.requestInfo.accountExists) Some("REUSED_EXISTING_PAYMENT_METHOD") else None,
          if (isSixForSix(stateAndInfo)) Some("guardian-weekly-six-for-six") else None,
          stateAndInfo.state.giftRecipient.map(_ => "gift-subscription")
        ).flatten)

      def isSixForSix(stateAndInfo: SendAcquisitionEventStateAndRequestInfo) =
        stateAndInfo.state.product.billingPeriod == Quarterly && stateAndInfo.state.promoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)
    }
}
