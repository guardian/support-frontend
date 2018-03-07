package services

import anorm._
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
  def insertContributionData(data: ContributionData): Future[Unit]
}

class PostgresDatabaseService private (database: Database)(implicit pool: JdbcThreadPool)
  extends DatabaseService with StrictLogging {

  private def executeTransaction(insertStatement: SimpleSql[Row]): Future[Unit] =
    Future(database.withConnection { implicit conn => insertStatement.execute() })
      .attemptT
      .fold(
        err => logger.error("unable to insert contribution into database", err),
        _ => logger.info("contribution inserted into database")
      )

  override def insertContributionData(data: ContributionData): Future[Unit] = {

    val transaction = SQL"""
      BEGIN;

      INSERT INTO live_contributors AS lc (
        receipt_email,
        iduser,
        updated
      ) VALUES (
        ${data.receiptEmail},
        ${data.identityId},
        ${data.created}
      ) ON CONFLICT (receipt_email) DO
      UPDATE SET
        iduser = COALESCE(EXCLUDED.iduser, lc.iduser),
        updated = EXCLUDED.updated;

      INSERT INTO contribution_metadata (
        contributionid,
        created,
        email
      ) VALUES (
        ${data.contributionId}::uuid,
        ${data.created},
        ${data.receiptEmail}
      );

      INSERT INTO payment_hooks (
        contributionid,
        paymentid,
        provider,
        created,
        currency,
        amount,
        status,
        email
      ) VALUES (
        ${data.contributionId}::uuid,
        ${data.paymentId},
        ${data.paymentProvider.entryName}::paymentProvider,
        ${data.created},
        ${data.currency.entryName},
        ${data.amount},
        ${data.paymentStatus.entryName}::paymentStatus,
        ${data.receiptEmail}
      );

      COMMIT;
    """

    executeTransaction(transaction)
  }
}

object PostgresDatabaseService {

  def fromDatabase(database: Database)(implicit pool: JdbcThreadPool): PostgresDatabaseService =
    new PostgresDatabaseService(database)
}
