package com.gu.i18n

sealed trait Currency {
  def prefix: Option[String] = None
  def glyph: String
  def identifier: String = prefix.getOrElse("") + glyph
  def iso: String
}

object Currency {
  val all = List(GBP, USD, AUD, CAD, EUR, NZD)

  def fromString(s: String): Option[Currency] = all.find(_.iso == s)

  case object GBP extends Currency {
    override def glyph = "£"
    override def iso = "GBP"
  }
  case object USD extends Currency {
    override def glyph = "$"
    override def prefix = Some("US")
    override def iso = "USD"
  }
  case object AUD extends Currency {
    override def glyph = "$"
    override def prefix = Some("AU")
    override def iso = "AUD"
  }
  case object CAD extends Currency {
    override def glyph = "$"
    override def prefix = Some("CA")
    override def iso = "CAD"
  }
  case object EUR extends Currency {
    override def glyph = "€"
    override def iso = "EUR"
  }
  case object NZD extends Currency {
    override def glyph = "$"
    override def prefix = Some("NZ")
    override def iso = "NZD"
  }

}
