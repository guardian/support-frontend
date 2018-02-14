package services

import com.gocardless.GoCardlessClient
import com.gocardless.GoCardlessClient.Environment
import com.gocardless.errors.GoCardlessApiException
import com.gocardless.resources.BankDetailsLookup.AvailableDebitScheme
import models.CheckBankAccountDetails
import monitoring.SafeLogger
import monitoring.SafeLogger._
import services.touchpoint.TouchpointService
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GoCardlessService(token: String, environment: Environment) extends TouchpointService {

  lazy val client = GoCardlessClient.create(token, environment)

  /**
   *
   * @return true if either the bank details are correct, or the rate limit for this enpoint is reached.
   *         In the latter case an error is logged.
   */
  def checkBankDetails(bankAccountData: CheckBankAccountDetails): Future[Boolean] = {
    Future {
      client.bankDetailsLookups().create()
        .withAccountNumber(bankAccountData.accountNumber.value)
        .withBranchCode(bankAccountData.sortCode.value)
        .withCountryCode("GB")
        .execute()
    } map { bdl =>
      bdl.getAvailableDebitSchemes.contains(AvailableDebitScheme.BACS)
    } recover {
      case e: GoCardlessApiException =>
        if (e.getCode == 429) {
          SafeLogger.error(scrub"Bypassing preliminary bank account check - GoCardless rate limit has been exceeded")
          true
        } else {
          false
        }
    }
  }
}