package com.gu.helpers

import org.joda.time.{DateTime, DateTimeZone, LocalDate, LocalTime}

object DateGenerator {
  def apply(fixedDate: LocalDate): DateGenerator = new DateGenerator(
    Some((fixedDate, fixedDate.toDateTime(LocalTime.MIDNIGHT))),
  )

  def apply(fixedDateTime: DateTime): DateGenerator = new DateGenerator(
    Some((fixedDateTime.toLocalDate, fixedDateTime)),
  )
}

class DateGenerator(fixedDate: Option[(LocalDate, DateTime)] = None) {

  def now: DateTime = fixedDate.map(_._2).getOrElse(DateTime.now(DateTimeZone.UTC))

  def today: LocalDate = fixedDate.map(_._1).getOrElse(now.toLocalDate)

}
