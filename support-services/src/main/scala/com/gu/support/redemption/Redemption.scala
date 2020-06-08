package com.gu.support.redemption

object RedemptionCode {
  def apply(codeAsString: String): Either[String, RedemptionCode] = {
    // make sure no one can inject anything bad
    val validChars = (('A' to 'Z') ++ ('0' to '9') ++ Seq('-')).toSet
    if (codeAsString.forall(validChars.contains))
      Right(new RedemptionCode(codeAsString))
    else
      Left(s"redemption code must only include ${validChars.mkString("")}")
  }
}
case class RedemptionCode private (codeAsString: String) extends AnyVal
