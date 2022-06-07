package com.gu.support.acquisitions.acquisitionsValueCalculator

import com.gu.support.acquisitions.models._

case class PrintOptionsModel(
  product: PrintProduct,
  deliveryCountryCode: String
)

case class AcquisitionModel(
   amount: Double,
   product: Product,
   currency: String,
   paymentFrequency: PaymentFrequency,
   paymentProvider: Option[PaymentProvider],
   printOptions: Option[PrintOptionsModel])
