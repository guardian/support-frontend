package services

import anorm._
import cats.syntax.either._
import com.typesafe.scalalogging.StrictLogging
import play.api.db.{Database, Databases}

import conf.DBConfig
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
        ${data.currency},
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

  def apply(database: Database): PostgresDatabaseService = new PostgresDatabaseService(database)

  // Used to create a service for testing purposes.
  private[services] def fromDBConfig(config: DBConfig): PostgresDatabaseService = {
    import config._
    PostgresDatabaseService(
      Databases(
        driver = driver,
        url = url,
        name = env.entryName,
        config = Map(
          "username" -> username,
          "password" -> password
        )
      )
    )
  }
}
