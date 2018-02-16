package model.db

case class ContributionDataInsertError(message: String) extends Exception {
  override val getMessage: String = message
}
