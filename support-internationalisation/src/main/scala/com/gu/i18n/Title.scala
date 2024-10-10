package com.gu.i18n

case class Title(title: String)

object Title {
  val Mr: Title = Title("Mr")
  val Mrs: Title = Title("Mrs")
  val Ms: Title = Title("Ms")
  val Miss: Title = Title("Miss")
  val Mx: Title = Title("Mx")
  val Dr: Title = Title("Dr")
  val Prof: Title = Title("Prof")
  val Rev: Title = Title("Rev")
  val all: Seq[Title] = Seq(Mr, Mrs, Ms, Miss, Mx, Dr, Prof, Rev)
  def fromString(str: String): Option[Title] = all.find { _.title == str }
}
