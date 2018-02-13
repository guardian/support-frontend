package services

import cats.syntax.either._
import com.stripe.model.Charge
import com.stripe.net.RequestOptions

import scala.collection.JavaConverters._

import conf.{StripeAccountConfig, StripeConfig}
import model.Currency
import model.stripe._

trait StripeService {

  // TODO: decide if this needs to be asynchronous
  def createCharge(data: StripeChargeData): Either[StripeChargeError, StripeChargeSuccess]
}

class SingleAccountStripeService(config: StripeAccountConfig) extends StripeService {

  private val requestOptions = RequestOptions.builder().setApiKey(config.secretKey).build()

  private def getChargeParams(data: StripeChargeData) =
    Map[String, AnyRef](
      "amount" -> new Integer(data.amount),
      "currency" -> data.currency.entryName,
      "source" -> data.source
    ).asJava

  def createCharge(data: StripeChargeData): Either[StripeChargeError, StripeChargeSuccess] =
    Either.catchNonFatal(Charge.create(getChargeParams(data), requestOptions))
      .bimap(StripeChargeError.fromThrowable, StripeChargeSuccess.fromStripeCharge)
}

// Create charges against out default Stripe account
class DefaultStripeService(config: StripeAccountConfig.Default) extends SingleAccountStripeService(config)

// Create charges against our Australia Stripe account
class AustraliaStripeService(config: StripeAccountConfig.Australia) extends SingleAccountStripeService(config)

// Our default Stripe account was charging people from Australia in USD,
// which meant they occurred additional transaction costs.
// The solution was to setup an Australia specific Stripe account,
// so that readers could pay in AUD.
class CurrencyBasedStripeService(default: DefaultStripeService, au: AustraliaStripeService) extends StripeService {

  private def getSingleAccountService(currency: Currency): StripeService =
    if (currency == Currency.AUD) au else default

  override def createCharge(data: StripeChargeData): Either[StripeChargeError, StripeChargeSuccess] =
    getSingleAccountService(data.currency).createCharge(data)
}

object StripeService {

  def fromConfig(config: StripeConfig): StripeService = {
    val default = new DefaultStripeService(config.default)
    val au = new AustraliaStripeService(config.au)
    new CurrencyBasedStripeService(default, au)
  }
}