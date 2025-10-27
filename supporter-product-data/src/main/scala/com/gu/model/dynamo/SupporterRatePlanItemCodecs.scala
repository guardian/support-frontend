package com.gu.model.dynamo

import com.gu.model.ZuoraFieldNames._
import com.gu.supporterdata.model.{ContributionAmount, SupporterRatePlanItem}
import io.circe.{Codec, Decoder}
import io.circe.generic.semiauto.deriveCodec
import kantan.csv.HeaderDecoder
import kantan.csv.java8.defaultLocalDateCellDecoder

import java.time.format.DateTimeFormatter
import java.time.{LocalDate, OffsetDateTime}

object SupporterRatePlanItemCodecs {
  implicit val decoder: HeaderDecoder[SupporterRatePlanItem] =
    HeaderDecoder.decoder(
      subscriptionName,
      identityId,
      productRatePlanId,
      productRatePlanName,
      termEndDate,
      contractEffectiveDate,
    )(
      (
          subscriptionName,
          identityId,
          productRatePlanId,
          productRatePlanName,
          termEndDate,
          contractEffectiveDate,
      ) =>
        SupporterRatePlanItem(
          subscriptionName,
          identityId,
          productRatePlanId,
          productRatePlanName,
          termEndDate,
          contractEffectiveDate,
          None,
        ),
    )

  implicit val localDateDecoder: Decoder[LocalDate] = Decoder.decodeString.emap { str =>
    try {
      Right(LocalDate.parse(str))
    } catch {
      case _: Exception =>
        try {
          Right(OffsetDateTime.parse(str).toLocalDate)
        } catch {
          case _: Exception => Left(s"Could not parse date: $str")
        }
    }
  }

  implicit val codec: Codec[SupporterRatePlanItem] = deriveCodec
  implicit val contributionCodec: Codec[ContributionAmount] = deriveCodec
}
