package services

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.instances.future._
import cats.syntax.applicativeError._
import com.stripe.model.Charge
import com.stripe.net.RequestOptions
import com.typesafe.scalalogging.StrictLogging

import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future}

import conf.{StripeAccountConfig, StripeConfig}
import model._
import model.stripe._

trait StripeService {

  // TODO: decide if this needs to be asynchronous
  def createCharge(data: StripeChargeData): EitherT[Future, StripeChargeError, Charge]
}

class SingleAccountStripeService(config: StripeAccountConfig)(implicit ec: ExecutionContext) extends StripeService with StrictLogging {

  // Don't set the secret API key globally (i.e. Stripe.apiKey = "api_key")
  // since charges in AUD and other currencies (respectively) will be made against different accounts.
  private val requestOptions = RequestOptions.builder().setApiKey(config.secretKey).build()

  // https://stripe.com/docs/api/java#create_charge
  private def getChargeParams(data: StripeChargeData) =
    Map[String, AnyRef](
      "amount" -> new Integer(data.paymentData.amount),
      "currency" -> data.paymentData.currency.entryName,
      "source" -> data.paymentData.source,
      "receipt_email" -> data.identityData.email
    ).asJava

  def createCharge(data: StripeChargeData): EitherT[Future, StripeChargeError, Charge] =
    Future(Charge.create(getChargeParams(data), requestOptions))
      .attemptT
      .bimap(
        err => {
          logger.error("unable to create Stripe charge", err)
          StripeChargeError.fromThrowable(err)
        },
        charge => {
          logger.info("Stripe charge created")
          charge
        }
      )
}

// Create charges against out default Stripe account
class DefaultStripeService(config: StripeAccountConfig.Default)(implicit ec: ExecutionContext)
  extends SingleAccountStripeService(config)

// Create charges against our Australia Stripe account
class AustraliaStripeService(config: StripeAccountConfig.Australia)(implicit ec: ExecutionContext)
  extends SingleAccountStripeService(config)

// Our default Stripe account was charging people from Australia in USD,
// which meant they occurred additional transaction costs.
// The solution was to setup an Australia specific Stripe account,
// so that readers could pay in AUD.
class CurrencyBasedStripeService(default: DefaultStripeService, au: AustraliaStripeService) extends StripeService {

  private def getSingleAccountService(currency: Currency): StripeService =
    if (currency == Currency.AUD) au else default

  override def createCharge(data: StripeChargeData): EitherT[Future, StripeChargeError, Charge] =
    getSingleAccountService(data.paymentData.currency).createCharge(data)
}

object StripeService {

  def fromConfig(config: StripeConfig)(implicit system: ActorSystem): InitializationResult[StripeService] =
    ThreadPool.Stripe.load().map { implicit ec =>
      val default = new DefaultStripeService(config.default)
      val au = new AustraliaStripeService(config.au)
      new CurrencyBasedStripeService(default, au)
    }
}