package services

import cats.data.EitherT
import cats.implicits._
import com.stripe.model.{Charge, Event, PaymentIntent}
import com.stripe.net.RequestOptions
import com.stripe.param.PaymentIntentCreateParams
import com.stripe.param.PaymentIntentCreateParams.ConfirmationMethod
import com.typesafe.scalalogging.StrictLogging

import scala.collection.JavaConverters._
import scala.concurrent.Future
import conf.{StripeAccountConfig, StripeConfig}
import model._
import model.stripe._

trait StripeService {

  def createCharge(data: LegacyStripeChargeRequest): EitherT[Future, StripeApiError, Charge]
  def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit]

  def createPaymentIntent(
      data: StripePaymentIntentRequest.CreatePaymentIntent,
  ): EitherT[Future, StripeApiError, PaymentIntent]
  def confirmPaymentIntent(
      request: StripePaymentIntentRequest.ConfirmPaymentIntent,
  ): EitherT[Future, StripeApiError, PaymentIntent]
}

class SingleAccountStripeService(config: StripeAccountConfig)(implicit pool: StripeThreadPool)
    extends StripeService
    with StrictLogging {

  // Don't set the secret API key globally (i.e. Stripe.apiKey = "api_key")
  // since charges in AUD and other currencies (respectively) will be made against different accounts.
  private val requestOptions = RequestOptions.builder().setApiKey(config.secretKey).build()

  // https://stripe.com/docs/api/java#create_charge
  private def getChargeParams(data: LegacyStripeChargeRequest) =
    Map[String, AnyRef](
      "amount" -> new Integer((data.paymentData.amount * 100).toInt), // -- stripe amount must be in pence
      "currency" -> data.paymentData.currency.entryName,
      "source" -> data.paymentData.token.value,
      "receipt_email" -> data.paymentData.email.value,
    ).asJava

  def createCharge(data: LegacyStripeChargeRequest): EitherT[Future, StripeApiError, Charge] = {
    if (model.Currency.exceedsMaxAmount(data.paymentData.amount, data.paymentData.currency)) {
      Left(StripeApiError.fromString("Amount exceeds the maximum allowed ", Some(config.publicKey))).toEitherT[Future]
    } else {
      Future(Charge.create(getChargeParams(data), requestOptions)).attemptT
        .bimap(
          err => StripeApiError.fromThrowable(err, Some(config.publicKey)),
          charge => {
            logger.info(s"Stripe charge with id ${charge.getId} created")
            charge
          },
        )
    }
  }

  def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] = {
    Future(Event.retrieve(stripeHook.id, requestOptions)).attemptT
      .bimap(
        err => {
          logger.error(
            s"Refund webhook event is not valid. Stripe sent $stripeHook. " +
              s"Attempting to retrieve a matching event gave: ",
            err,
          )
          StripeApiError.fromThrowable(err, Some(config.publicKey))
        },
        event => {
          logger.info("Refund webhook event is valid")
        },
      )
  }

  def createPaymentIntent(
      data: StripePaymentIntentRequest.CreatePaymentIntent,
  ): EitherT[Future, StripeApiError, PaymentIntent] = {
    if (model.Currency.exceedsMaxAmount(data.paymentData.amount, data.paymentData.currency)) {
      Left(StripeApiError.fromString("Amount exceeds the maximum allowed ", Some(config.publicKey))).toEitherT[Future]
    } else {
      Future {
        val params = PaymentIntentCreateParams.builder
          .setPaymentMethod(data.paymentMethodId)
          .setAmount((data.paymentData.amount * 100).toLong) // Stripe amount must be in pence
          .setCurrency(data.paymentData.currency.entryName)
          .setReceiptEmail(data.paymentData.email.value)
          .setConfirmationMethod(
            ConfirmationMethod.MANUAL,
          ) // Allows us to do 3DS auth and final confirmation as separate steps
          .setConfirm(true) // If 3DS is not required then it will go ahead and complete the payment
          .build

        PaymentIntent.create(params, requestOptions)
      }
    }.attemptT
      .bimap(
        err => StripeApiError.fromThrowable(err, Some(config.publicKey)),
        paymentIntent => {
          logger.info(
            s"Created Stripe Payment Intent with id ${paymentIntent.getId}, status ${paymentIntent.getStatus}",
          )
          paymentIntent
        },
      )
  }

  def confirmPaymentIntent(
      data: StripePaymentIntentRequest.ConfirmPaymentIntent,
  ): EitherT[Future, StripeApiError, PaymentIntent] = {
    val result = for {
      paymentIntent <- Future(PaymentIntent.retrieve(data.paymentIntentId, requestOptions)).attemptT
      confirmedPaymentIntent <- Future(paymentIntent.confirm(requestOptions)).attemptT
    } yield confirmedPaymentIntent

    result.bimap(
      err => StripeApiError.fromThrowable(err, Some(config.publicKey)),
      paymentIntent => {
        logger.info(s"Confirmed Stripe Payment Intent with id ${paymentIntent.getId}")
        paymentIntent
      },
    )
  }

  def iAmForThisPublicKey(publicKey: StripePublicKey): Boolean = config.publicKey == publicKey.value
}

// Create charges against out default Stripe account
class DefaultStripeService(config: StripeAccountConfig.Default)(implicit pool: StripeThreadPool)
    extends SingleAccountStripeService(config)

// Create charges against our Australia Stripe account
class AustraliaStripeService(config: StripeAccountConfig.Australia)(implicit pool: StripeThreadPool)
    extends SingleAccountStripeService(config)

// Create charges against our Australia Stripe account
class UnitedStatesStripeService(config: StripeAccountConfig.UnitedStates)(implicit pool: StripeThreadPool)
    extends SingleAccountStripeService(config)

// This provider exists for 2 reasons:
// 1) Customers in Australia who transacted with our DefaultStripeService (in AUD) were paying an international banking
// fee as that account is linked to UK-based bank accounts. So we created a specific Stripe account based in Australia
// enabling it to be attached to an Australian bank account. This meant there is no international banking.
// 2) We created a second Stripe account in the US, attached to a US bank, so that customers in the United States can
// use additional credit cards such as Discover and Diners.
class CountryBasedStripeService(
    default: DefaultStripeService,
    au: AustraliaStripeService,
    us: UnitedStatesStripeService,
)(implicit
    pool: StripeThreadPool,
) extends StripeService
    with StrictLogging {

  private def getBackwardsCompatibleAccount(data: StripeRequest) =
    if (data.paymentData.currency == Currency.AUD) au else default

  private def getAccountForPublicKey(publicKey: StripePublicKey): StripeService =
    Seq(au, us).find(_.iAmForThisPublicKey(publicKey)) getOrElse default

  private def getAccountToUse(data: StripeRequest): StripeService =
    data.publicKey.map(getAccountForPublicKey) getOrElse getBackwardsCompatibleAccount(data)

  private def validateRefundHookForUSD(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] =
    us.validateRefundHook(stripeHook) orElse default.validateRefundHook(stripeHook)

  override def createCharge(data: LegacyStripeChargeRequest): EitherT[Future, StripeApiError, Charge] =
    getAccountToUse(data).createCharge(data)

  override def createPaymentIntent(
      data: StripePaymentIntentRequest.CreatePaymentIntent,
  ): EitherT[Future, StripeApiError, PaymentIntent] =
    getAccountToUse(data).createPaymentIntent(data)

  override def confirmPaymentIntent(
      data: StripePaymentIntentRequest.ConfirmPaymentIntent,
  ): EitherT[Future, StripeApiError, PaymentIntent] =
    getAccountToUse(data).confirmPaymentIntent(data)

  override def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] = {
    val stripeCurrency = stripeHook.data.`object`.currency.toUpperCase
    Currency.withNameOption(stripeCurrency) match {
      case Some(Currency.AUD) => au.validateRefundHook(stripeHook)
      case Some(Currency.USD) => validateRefundHookForUSD(stripeHook)
      case Some(_) => default.validateRefundHook(stripeHook)
      case None => {
        val errorMessage = s"Invalid currency. $stripeCurrency"
        logger.error(errorMessage)
        Left(StripeApiError.fromString(errorMessage, publicKey = None)).toEitherT[Future]
      }
    }
  }
}

object StripeService {

  def fromStripeConfig(config: StripeConfig)(implicit pool: StripeThreadPool): StripeService = {
    val default = new DefaultStripeService(config.default)
    val au = new AustraliaStripeService(config.au)
    val us = new UnitedStatesStripeService(config.us)
    new CountryBasedStripeService(default, au, us)
  }
}
