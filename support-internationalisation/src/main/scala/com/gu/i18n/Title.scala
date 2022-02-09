package com.gu.i18n

case class Title(title: String)

object Title {
  val Mr = Title("Mr")
  val Mrs = Title("Mrs")
  val Ms = Title("Ms")
  val Miss = Title("Miss")
  val Mx = Title("Mx")
  val Dr = Title("Dr")
  val Prof = Title("Prof")
  val Rev = Title("Rev")
  val all = Seq(Mr, Mrs, Ms, Miss, Mx, Dr, Prof, Rev)
  def fromString(str: String): Option[Title] = all.find { _.title == str }
}
