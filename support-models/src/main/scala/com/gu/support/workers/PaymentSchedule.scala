package com.gu.support.workers

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.zuora.api.response.Charge
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import org.joda.time.LocalDate

case class Payment(date: LocalDate, amount: Double)
case class PaymentSchedule(payments: List[Payment])

object PaymentSchedule {
  def round(d: Double) = BigDecimal(d).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble
  implicit val decoder: Decoder[Payment] = deriveDecoder[Payment].map(payment =>
    payment.copy(
      amount = round(payment.amount),
    ),
  )
  implicit val encoder: Encoder[Payment] = deriveEncoder
  implicit val paymentScheduleCodec: Codec[PaymentSchedule] = deriveCodec
}
