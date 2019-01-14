package com.gu.support.workers

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import org.joda.time.LocalDate

case class Payment(date: LocalDate, amount: Double)
case class PaymentSchedule(payments: List[Payment])

object PaymentSchedule {
  implicit val paymentCodec: Codec[Payment] = deriveCodec
  implicit val paymentScheduleCodec: Codec[PaymentSchedule] = deriveCodec
}
