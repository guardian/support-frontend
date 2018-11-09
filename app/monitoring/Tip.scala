package monitoring

import app.BuildInfo
import com.gu.support.config.Stages.PROD
import com.gu.tip.{Tip, TipConfig, TipFactory, TipResponse}
import config.Configuration

import scala.concurrent.Future

object TipFromConfig {

  def apply(config: Configuration): Tip = {

    val tipConfig = TipConfig(
      repo = "guardian/support-frontend",
      cloudEnabled = true,
      boardSha = BuildInfo.gitCommitId
    )

    if (config.stage == PROD)
      TipFactory.create(tipConfig)
    else
      TipFactory.createDummy(tipConfig)
  }

}

object PathVerification {

  type VerifyPath = String => Future[TipResponse]

  sealed trait MonitoredRegion
  case object AU extends MonitoredRegion
  case object GB extends MonitoredRegion
  case object US extends MonitoredRegion

  sealed trait MonitoredProduct
  case object OneOffContribution extends MonitoredProduct { override def toString: String = "One-off contribution" }
  case object RecurringContribution extends MonitoredProduct { override def toString: String = "Recurring contribution" }

  sealed trait MonitoredPaymentMethod
  case object DirectDebit extends MonitoredPaymentMethod { override def toString: String = "Direct Debit" }
  case object PayPal extends MonitoredPaymentMethod
  case object Stripe extends MonitoredPaymentMethod

  case class TipPath(region: MonitoredRegion, product: MonitoredProduct, paymentMethod: MonitoredPaymentMethod) {
    override def toString: String = s"$region $product with $paymentMethod"
  }

  def monitoredRegion(country: String): Option[MonitoredRegion] = country match {
    case "AU" => Some(AU)
    case "GB" => Some(GB)
    case "US" => Some(US)
    case _ => None
  }

  def verify(tipPath: TipPath, verifier: VerifyPath): Future[TipResponse] = {
    verifier(tipPath.toString)
  }

}
