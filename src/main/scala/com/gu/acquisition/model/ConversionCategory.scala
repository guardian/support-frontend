package com.gu.acquisition.model

private [acquisition] sealed trait ConversionCategory {
  val name: String
}

private [acquisition] object ConversionCategory {
  case object PrintConversion extends ConversionCategory {
    override val name = "PrintConversion"
  }

  case object DigitalConversion extends ConversionCategory {
    override val name = "DigitalConversion"
  }

  case object ContributionConversion extends ConversionCategory {
    override val name = "ContributionConversion"
  }
}
