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

  sealed trait MonitoredRegion { val tipString: String }
  case object AU extends MonitoredRegion { val tipString = "AU" }
  case object UK extends MonitoredRegion { val tipString = "UK" }
  case object US extends MonitoredRegion { val tipString = "US" }

  sealed trait MonitoredProduct { val tipString: String }
  case object OneOffContribution extends MonitoredProduct { val tipString = "One-off contribution" }
  case object RecurringContribution extends MonitoredProduct { val tipString = "Recurring contribution" }

  sealed trait MonitoredPaymentMethod { val tipString: String }
  case object DirectDebit extends MonitoredPaymentMethod { val tipString = "Direct Debit" }
  case object PayPal extends MonitoredPaymentMethod { val tipString = "PayPal" }
  case object Stripe extends MonitoredPaymentMethod { val tipString = "Stripe" }

  case class TipPath(region: MonitoredRegion, product: MonitoredProduct, paymentMethod: MonitoredPaymentMethod) {
    val configPath: String = s"${region.tipString} ${product.tipString} with ${paymentMethod.tipString}"
  }

  def monitoredRegion(country: String): Option[MonitoredRegion] = country.toUpperCase match {
    case "AU" => Some(AU)
    case "UK" => Some(UK)
    case "US" => Some(US)
    case _ => None
  }

  def verify(tipPath: TipPath, verifier: VerifyPath): Future[TipResponse] = {
    verifier(tipPath.configPath)
  }

}
