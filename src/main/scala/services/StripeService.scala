package services

import cats.data.EitherT
import cats.implicits._
import com.stripe.model.{Charge, Event}
import com.stripe.net.RequestOptions
import com.typesafe.scalalogging.StrictLogging

import scala.collection.JavaConverters._
import scala.concurrent.Future
import conf.{StripeAccountConfig, StripeConfig}
import model._
import model.stripe._


trait StripeService {

  def createCharge(data: StripeChargeData): EitherT[Future, StripeApiError, Charge]
  def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit]
}

class SingleAccountStripeService(config: StripeAccountConfig)(implicit pool: StripeThreadPool) extends StripeService with StrictLogging {

  // Don't set the secret API key globally (i.e. Stripe.apiKey = "api_key")
  // since charges in AUD and other currencies (respectively) will be made against different accounts.
  private val requestOptions = RequestOptions.builder().setApiKey(config.secretKey).build()

  // https://stripe.com/docs/api/java#create_charge
  private def getChargeParams(data: StripeChargeData) =
    Map[String, AnyRef](
      "amount" -> new Integer((data.paymentData.amount * 100).toInt), //-- stripe amount must be in pence
      "currency" -> data.paymentData.currency.entryName,
      "source" -> data.paymentData.token.value,
      "receipt_email" -> data.paymentData.email.value
    ).asJava

  def createCharge(data: StripeChargeData): EitherT[Future, StripeApiError, Charge] = {
    if (model.Currency.exceedsMaxAmount(data.paymentData.amount, data.paymentData.currency)) {
      Left(StripeApiError.fromString("Amount exceeds the maximum allowed ")).toEitherT[Future]
    } else {
      Future(Charge.create(getChargeParams(data), requestOptions))
        .attemptT
        .bimap(
          StripeApiError.fromThrowable,
          charge => {
            logger.info(s"Stripe charge with id ${charge.getId} created")
            charge
          }
        )
    }
  }

  def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] = {
    Future(Event.retrieve(stripeHook.id, requestOptions))
      .attemptT
      .bimap(
        err => {
          logger.error(s"Refund webhook event is not valid. Stripe sent $stripeHook. " +
            s"Attempting to retrieve a matching event gave: ", err)
          StripeApiError.fromThrowable(err)
        },
        event => {
          logger.info("Refund webhook event is valid")
        }
      )
  }

  def iAmForThisPublicKey(publicKey: StripePublicKey): Boolean = config.publicKey == publicKey.value
}

// Create charges against out default Stripe account
class DefaultStripeService (config: StripeAccountConfig.Default)(implicit pool: StripeThreadPool)
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
class CountryBasedStripeService(default: DefaultStripeService, au: AustraliaStripeService, us: UnitedStatesStripeService)
                               (implicit pool: StripeThreadPool) extends StripeService with StrictLogging {

  private def getBackwardsCompatibleAccount(data: StripeChargeData) =
    if (data.paymentData.currency == Currency.AUD) au else default

  private def getAccountForPublicKey(publicKey: StripePublicKey): StripeService =
    Seq(au, us).find(_.iAmForThisPublicKey(publicKey)) getOrElse default

  private def validateRefundHookForUSD(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] =
    us.validateRefundHook(stripeHook) orElse default.validateRefundHook(stripeHook)

  override def createCharge(data: StripeChargeData): EitherT[Future, StripeApiError, Charge] = {
    val accountToUse = data.publicKey.map(getAccountForPublicKey) getOrElse getBackwardsCompatibleAccount(data)
    accountToUse.createCharge(data)
  }

  override def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] = {
    val stripeCurrency = stripeHook.data.`object`.currency.toUpperCase
    Currency.withNameOption(stripeCurrency) match {
      case Some(Currency.AUD) => au.validateRefundHook(stripeHook)
      case Some(Currency.USD) => validateRefundHookForUSD(stripeHook)
      case Some(_) => default.validateRefundHook(stripeHook)
      case None => {
        val errorMessage = s"Invalid currency. $stripeCurrency"
        logger.error(errorMessage)
        Left(StripeApiError.fromString(errorMessage)).toEitherT[Future]
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
