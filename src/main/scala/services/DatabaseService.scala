package services

import anorm._
import cats.data.EitherT
import cats.syntax.applicativeError._
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.db.Database

import scala.concurrent.Future
import model.JdbcThreadPool
import model.db.ContributionData


trait DatabaseService {

  // If an insert is unsuccessful then an error should be logged, however,
  // the return type is not modelled as an EitherT,
  // since the result of the insert has no dependencies.
  // See e.g. backend.StripeBackend for more context.
  def insertContributionData(data: ContributionData): EitherT[Future, DatabaseService.Error, Unit]
  def flagContributionAsRefunded(paymentId: String): EitherT[Future, DatabaseService.Error, Unit]
}

object DatabaseService {
  case class Error(message: String, err: Option[Throwable]) extends Exception {
    override def getMessage: String = err.fold(message)(error => s"$message - ${error.getMessage}")
  }
}

class PostgresDatabaseService private (database: Database)(implicit pool: JdbcThreadPool)
  extends DatabaseService with StrictLogging {

  private def executeQuery(insertStatement: SimpleSql[Row]): EitherT[Future, DatabaseService.Error, Unit] =
    Future(database.withConnection { implicit conn => insertStatement.execute() })
      .attemptT
      .bimap(
        err => {
          logger.error(s"unable to insert contribution into database. Error: $err")
          DatabaseService.Error("unable to insert contribution into database", Some(err))
        },
        _ => logger.info("contribution inserted into database")
      )

  override def insertContributionData(data: ContributionData): EitherT[Future, DatabaseService.Error, Unit] = {
    val query = SQL"""
      INSERT INTO contributions (
        id,
        payment_provider,
        payment_id,
        received_timestamp,
        currency,
        country_code,
        amount,
        status,
        email,
        identity_id
      ) VALUES (
        ${data.contributionId}::uuid,
        ${data.paymentProvider.entryName}::paymentProvider,
        ${data.paymentId},
        ${data.created},
        ${data.currency.entryName},
        ${data.countryCode},
        ${data.amount},
        ${data.paymentStatus.entryName}::paymentStatus,
        ${data.receiptEmail},
        ${data.identityId}
      );
    """
    executeQuery(query)
  }

  override def flagContributionAsRefunded(paymentId: String): EitherT[Future, DatabaseService.Error, Unit] = {
    val query = SQL"""
      UPDATE contributions SET status = 'Refunded'::paymentStatus WHERE paymentid = $paymentId;
    """

    executeQuery(query)
  }

}

object PostgresDatabaseService {
  def fromDatabase(database: Database)(implicit pool: JdbcThreadPool): PostgresDatabaseService =
    new PostgresDatabaseService(database)
}

