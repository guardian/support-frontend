package com.gu.acquisition
package utils

object CurrencyUtils {
  def formatAmount(amount: Double, currencyCode: String): Double =
    if (currencyCode.equalsIgnoreCase("jpy")) amount else amount / 100
}
