package com.gu.support.catalog

sealed trait FulfilmentOptions[+T <: Product]

case object HomeDelivery extends FulfilmentOptions[Paper.type]

case object Collection extends FulfilmentOptions[Paper.type]

case object Domestic extends FulfilmentOptions[GuardianWeekly.type]

case object RestOfWorld extends FulfilmentOptions[GuardianWeekly.type]

case object NoFulfilmentOptions extends FulfilmentOptions[DigitalPack.type with Contribution.type]
