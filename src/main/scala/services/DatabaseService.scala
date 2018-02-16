package services

import play.api.db.Database

import model.db.{ContributionData, ContributionDataInsertError}

trait DatabaseService {

  // TODO: should this be asynchronous?
  // TODO: what should be the return type of the happy path?
  def insertContributionData(data: ContributionData): Either[ContributionDataInsertError, Unit]
}

class PostgresDatabaseService(database: Database) extends DatabaseService {

  override def insertContributionData(data: ContributionData): Either[ContributionDataInsertError, Unit] = {
    // TODO: implement
    Right(println("inserting contribution data into database"))
  }
}

object DatabaseService {

  def apply(database: Database): DatabaseService = new PostgresDatabaseService(database)
}