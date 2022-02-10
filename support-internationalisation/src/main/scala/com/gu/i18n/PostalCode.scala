package com.gu.i18n

sealed trait PostalCode {
  val name: String

  def apply(name: String): PostalCode = name match {
    case PostCode.name => PostCode
    case ZipCode.name => ZipCode
    case _ => PostCode
  }

  def unapply(postalCode: PostalCode): Option[String] = Some(postalCode.name)
}

case object PostCode extends PostalCode {
  override val name = "Postcode"
}

case object ZipCode extends PostalCode {
  override val name = "Zip code"
}
