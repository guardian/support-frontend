package com.gu.support.acquisitions.ga.models

sealed trait ConversionCategory {
  val name: String
  val description: String
}

object ConversionCategory {
  case object PrintConversion extends ConversionCategory {
    override val name = "PrintConversion"
    override val description = "PrintSubscription"
  }

  case object DigitalConversion extends ConversionCategory {
    override val name = "DigitalConversion"
    override val description = "DigitalSubscription"
  }

  case object ContributionConversion extends ConversionCategory {
    override val name = "ContributionConversion"
    override val description = "Contribution"
  }
}
