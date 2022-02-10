package services

import com.gocardless.GoCardlessClient
import com.gocardless.GoCardlessClient.Environment
import com.gocardless.errors.GoCardlessApiException
import com.gocardless.resources.BankDetailsLookup.AvailableDebitScheme
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.config.GoCardlessConfig
import com.gu.support.gocardless.GoCardlessService
import models.CheckBankAccountDetails

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GoCardlessFrontendService(config: GoCardlessConfig) extends GoCardlessService(config) {

  lazy val client = GoCardlessClient.create(config.apiToken, Environment.valueOf(config.environment))

  /** @return
    *   true if either the bank details are correct, or the rate limit for this endpoint is reached. In the latter case
    *   an error is logged.
    */
  def checkBankDetails(bankAccountData: CheckBankAccountDetails): Future[Boolean] = {
    Future {
      client
        .bankDetailsLookups()
        .create()
        .withAccountNumber(bankAccountData.accountNumber.value)
        .withBranchCode(bankAccountData.sortCode.value)
        .withCountryCode("GB")
        .execute()
    } map { bdl =>
      bdl.getAvailableDebitSchemes.contains(AvailableDebitScheme.BACS)
    } recover { case e: GoCardlessApiException =>
      if (e.getCode == 429) {
        SafeLogger.error(scrub"Bypassing preliminary bank account check - GoCardless rate limit has been exceeded")
        true
      } else {
        false
      }
    }
  }
}
