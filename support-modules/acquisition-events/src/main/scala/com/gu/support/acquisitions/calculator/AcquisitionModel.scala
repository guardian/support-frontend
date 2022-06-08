package com.gu.support.acquisitions.calculator

import com.gu.support.acquisitions.models.{AcquisitionProduct, PaymentFrequency, PaymentProvider}

case class AcquisitionModel(
    amount: Double,
    product: AcquisitionProduct,
    currency: String,
    paymentFrequency: PaymentFrequency,
    paymentProvider: Option[PaymentProvider],
    printOptions: Option[PrintOptionsModel],
)
