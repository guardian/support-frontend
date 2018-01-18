package models

case class DirectDebitData(accountNumber: String, sortCodeValue: String, accountHolderName: String) {
  val sortCode = sortCodeValue.filter(_.isDigit)
}