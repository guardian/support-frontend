package com.gu.stripe

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

object Stripe {

  object StripeList {
    implicit def decoder[T](implicit decoder: Decoder[T]): Decoder[StripeList[T]] = deriveDecoder[StripeList[T]]
  }

  case class StripeList[T](total_count: Int, data: Seq[T])

  object BalanceTransaction {
    implicit val codec: Codec[BalanceTransaction] = deriveCodec
  }

  case class BalanceTransaction(id: String, source: String, amount: Int)

}
