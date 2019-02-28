package com.gu.support.encoding

object StringExtensions {
  implicit class ExtendedString(value: String) {
    def decapitalize: String = value.charAt(0).toLower + value.substring(1)
    def toOption: Option[String] = if (value.isEmpty) None else Some(value)
  }
}
