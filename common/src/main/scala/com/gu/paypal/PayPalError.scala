package com.gu.paypal

case class PayPalError(httpCode: Int, message: String) extends Throwable
