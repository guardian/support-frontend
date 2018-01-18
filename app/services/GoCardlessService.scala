package services

import scala.concurrent.Future
import com.typesafe.scalalogging.LazyLogging

trait GoCardlessService {
  def checkBankDetails(paymentData: DirectDebitData): Future[Boolean]
}

object GoCardlessService extends GoCardlessService with LazyLogging {
  lazy val client = Config.GoCardless.client

  /**
   *
   * @return true if either the bank details are correct, or the rate limit for this enpoint is reached.
   *         In the latter case an error is logged.
   */
  override def checkBankDetails(paymentData: DirectDebitData): Future[Boolean] = {
    Future {
      client.bankDetailsLookups().create()
        .withAccountNumber(paymentData.account)
        .withBranchCode(paymentData.sortCode)
        .withCountryCode("GB")
        .execute()
    } map { bdl =>
      bdl.getAvailableDebitSchemes.contains(AvailableDebitScheme.BACS)
    } recover {
      case e: GoCardlessApiException =>
        if (e.getCode == 429) {
          logger.error("Bypassing preliminary bank account check because the GoCardless rate limit has been reached for this endpoint. Someone might be using our website to proxy to GoCardless")
          true
        } else {
          false
        }
    }
  }
}