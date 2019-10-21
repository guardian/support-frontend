package utils

object ValidateEmail {

  private val emailRegex =
    """^[a-zA-Z0-9\.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$""".r

  def apply(email: String): EmailValidation = isValidEmail(email)

  def isValidEmail(email: String): EmailValidation = email match {
    case valid if emailRegex.findFirstMatchIn(valid).isDefined => ValidEmail(email)
    case _ => InvalidEmail
  }
}

sealed trait EmailValidation
case class ValidEmail(email: String) extends EmailValidation
case object InvalidEmail extends EmailValidation

