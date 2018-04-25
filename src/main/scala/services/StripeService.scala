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
      "source" -> data.paymentData.token,
      "receipt_email" -> data.paymentData.email
    ).asJava

  def createCharge(data: StripeChargeData): EitherT[Future, StripeApiError, Charge] = {
    if (model.Currency.exceedsMaxAmount(data.paymentData.amount, data.paymentData.currency)) {
      Left(StripeApiError.apply("Amount exceeds the maximum allowed ")).toEitherT[Future]
    } else {
      Future(Charge.create(getChargeParams(data), requestOptions))
        .attemptT
        .bimap(
          err => {
            logger.error("unable to create Stripe charge", err)
            StripeApiError.fromThrowable(err)
          },
          charge => {
            logger.info("Stripe charge created")
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
          logger.error("unable to retrieve Stripe event", err)
          StripeApiError.fromThrowable(err)
        },
        event => {
          logger.info("Stripe event retrieved")
        }
      )
  }
}

// Create charges against out default Stripe account
class DefaultStripeService (config: StripeAccountConfig.Default)(implicit pool: StripeThreadPool)
  extends SingleAccountStripeService(config)

// Create charges against our Australia Stripe account
class AustraliaStripeService(config: StripeAccountConfig.Australia)(implicit pool: StripeThreadPool)
  extends SingleAccountStripeService(config)

// Our default Stripe account was charging people from Australia in USD,
// which meant they occurred additional transaction costs.
// The solution was to setup an Australia specific Stripe account,
// so that readers could pay in AUD.
class CurrencyBasedStripeService(default: DefaultStripeService, au: AustraliaStripeService)
  (implicit pool: StripeThreadPool) extends StripeService with StrictLogging {

  private def getSingleAccountService(currency: Currency): StripeService =
    if (currency == Currency.AUD) au else default

  override def createCharge(data: StripeChargeData): EitherT[Future, StripeApiError, Charge] =
    getSingleAccountService(data.paymentData.currency).createCharge(data)

  override def validateRefundHook(stripeHook: StripeRefundHook): EitherT[Future, StripeApiError, Unit] = {
    val stripeCurrency = stripeHook.data.`object`.currency.toUpperCase
    Currency.withNameOption(stripeCurrency) match {
      case Some(currency) => getSingleAccountService(currency).validateRefundHook(stripeHook)
      case None => {
        val errorMessage = s"Invalid currency. $stripeCurrency"
        logger.error(errorMessage)
        Left(StripeApiError.apply(errorMessage)).toEitherT[Future]
      }
    }
  }

}

object StripeService {

  def fromStripeConfig(config: StripeConfig)(implicit pool: StripeThreadPool): StripeService = {
    val default = new DefaultStripeService(config.default)
    val au = new AustraliaStripeService(config.au)
    new CurrencyBasedStripeService(default, au)
  }
}
