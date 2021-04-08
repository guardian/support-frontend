package com.gu.helpers

object StringExtensions {
  implicit class ExtendedString(value: String) {
    def decapitalize: String = value.charAt(0).toLower.toString + value.substring(1)
  }
}
