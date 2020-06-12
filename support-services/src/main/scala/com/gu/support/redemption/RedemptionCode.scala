package com.gu.support.redemption

object RedemptionCode {
  def apply(value: String): Either[String, RedemptionCode] = {
    // make sure no one can inject anything bad
    val validChars = (('A' to 'Z') ++ ('0' to '9') ++ Seq('-')).toSet
    if (value.forall(validChars.contains))
      Right(new RedemptionCode(value))
    else
      Left(s"redemption code must only include ${validChars.mkString("")}")
  }
}
case class RedemptionCode private (value: String) extends AnyVal
