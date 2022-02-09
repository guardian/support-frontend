package services

import cats.data.EitherT
import com.gocardless.GoCardlessClient
import com.gocardless.errors.GoCardlessApiException
import com.gocardless.resources.BankDetailsLookup.AvailableDebitScheme
import com.typesafe.scalalogging.StrictLogging
import conf.GoCardlessConfig
import model._
import model.directdebit.CheckDirectDebitDetailsData

import scala.concurrent.Future

trait GoCardless {

  type GoCardlessResult[A] = EitherT[Future, Throwable, A]

  def checkBankAccount(data: CheckDirectDebitDetailsData): GoCardlessResult[Boolean]

}

class GoCardlessService(config: GoCardlessConfig)(implicit pool: GoCardlessThreadPool)
    extends GoCardless
    with StrictLogging {

  private lazy val client = GoCardlessClient.create(config.token, config.gcEnvironment)

  override def checkBankAccount(bankAccountData: CheckDirectDebitDetailsData): GoCardlessResult[Boolean] = {
    val logLinePrefix = s"checked bank details (bank account ends '${bankAccountData.accountNumber takeRight 3}') ->"
    EitherT(
      Future {
        client
          .bankDetailsLookups()
          .create()
          .withAccountNumber(bankAccountData.accountNumber)
          .withBranchCode(bankAccountData.sortCode)
          .withCountryCode("GB")
          .execute()
      } map { bdl =>
        {
          val valid = bdl.getAvailableDebitSchemes.contains(AvailableDebitScheme.BACS)
          logger.info(s"$logLinePrefix ${if (valid) "valid" else "invalid"}")
          Right(valid)
        }
      } recover { case error =>
        error match {
          case gcErr: GoCardlessApiException if gcErr.getCode == 422 =>
            logger.info(s"$logLinePrefix invalid (GoCardless Status Code : ${gcErr.getCode})")
          case gcErr: GoCardlessApiException =>
            logger.warn(s"$logLinePrefix invalid (GoCardless Status Code : ${gcErr.getCode})", gcErr)
          case unexpectedErr =>
            logger.error(s"$logLinePrefix error", unexpectedErr)
        }
        Left(error)
      },
    )
  }
}

object GoCardlessService {

  def fromGoCardlessConfig(config: GoCardlessConfig)(implicit pool: GoCardlessThreadPool): GoCardlessService =
    new GoCardlessService(config)
}
