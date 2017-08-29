package com.gu.support.workers.model

sealed trait Period {
  def fromString(code: String): Option[Period] = List(Monthly, Quarterly, Annual).find(_.getClass.getSimpleName == s"$code$$")
}

object Period extends Period

case object Monthly extends Period

case object Quarterly extends Period

case object Annual extends Period