package com.gu.support.catalog

sealed trait ProductOptions[T <: Product]

case object GuardianWeeklyOption extends ProductOptions[GuardianWeeklyOption.type]

case object DigitalPackOption extends ProductOptions[DigitalPack.type]

case object ContributionOption extends ProductOptions[Contribution.type]

case object Saturday extends ProductOptions[Paper.type]

case object SaturdayPlus extends ProductOptions[Paper.type]

case object Sunday extends ProductOptions[Paper.type]

case object SundayPlus extends ProductOptions[Paper.type]

case object Weekend extends ProductOptions[Paper.type]

case object WeekendPlus extends ProductOptions[Paper.type]

case object SixdayPlus extends ProductOptions[Paper.type]

case object Sixday extends ProductOptions[Paper.type]

case object EverydayPlus extends ProductOptions[Paper.type]

case object Everyday extends ProductOptions[Paper.type]




