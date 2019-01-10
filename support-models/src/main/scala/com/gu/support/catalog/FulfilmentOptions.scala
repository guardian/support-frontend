package com.gu.support.catalog

sealed trait FulfilmentOptions[T <: Product]

case object HomeDelivery extends FulfilmentOptions[Paper.type]

case object Collection extends FulfilmentOptions[Paper.type]

case object Domestic extends FulfilmentOptions[GuardianWeeklyOption.type]

case object RestOfWorld extends FulfilmentOptions[GuardianWeeklyOption.type]

case object DigitalFulfilment extends FulfilmentOptions[DigitalProduct]
