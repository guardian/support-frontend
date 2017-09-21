package com.gu.acquisition.utils

object CurrencyUtils {
  def formatAmount(amount: Double, currencyCode: String): Double =
    if (currencyCode.equalsIgnoreCase("jpy")) amount else amount / 100
}
