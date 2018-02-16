package services

import anorm._
import cats.syntax.either._
import com.typesafe.scalalogging.StrictLogging
import play.api.db.Database

import model.db.ContributionData

trait DatabaseService {

  // TODO: should this be asynchronous?
  // If an insert is unsuccessful then an error should be logged, however,
  // the return type is not modelled as an Either,
  // since the result of the insert has no dependencies.
  // See e.g. backend.StripeBackend for more context.
  def insertContributionData(data: ContributionData): Unit
}

class PostgresDatabaseService(database: Database) extends DatabaseService with StrictLogging {

  private def executeTransaction(insertStatement: SimpleSql[Row]): Unit =
    database.withConnection { implicit conn =>
      Either.catchNonFatal(insertStatement.execute())
        .bimap(
          err => logger.error("unable to insert contribution into database", err),
          _ => logger.info("contribution inserted into database")
        )
    }

  override def insertContributionData(data: ContributionData): Unit = {

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

      COMMIT;
    """

    executeTransaction(transaction)
  }
}

object DatabaseService {

  def apply(database: Database): DatabaseService = new PostgresDatabaseService(database)
}