package services

import com.gocardless.GoCardlessClient
import com.gocardless.GoCardlessClient.Environment
import com.gocardless.errors.GoCardlessApiException
import com.gocardless.resources.BankDetailsLookup.AvailableDebitScheme
import com.typesafe.scalalogging.LazyLogging
import models.CheckBankAccountDetails

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GoCardlessService(token: String, environment: Environment) extends LazyLogging {

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
          logger.error("Bypassing preliminary bank account check because the GoCardless rate limit" +
            " has been reached for this endpoint. Someone might be using our website to proxy to GoCardless")
          true
        } else {
          false
        }
    }
  }
}