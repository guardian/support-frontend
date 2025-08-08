package com.gu.salesforce

import cats.syntax.functor._
import com.gu.i18n.Title
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import com.gu.support.workers.{GiftRecipient, SalesforceContactRecord, User}
import com.gu.support.workers.exceptions.{RetryException, RetryNone, RetryUnlimited}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import org.joda.time.DateTime
import AddressLine.getAddressLine

object Salesforce {

  implicit val salesforceContactRecordCodec: Codec[SalesforceContactRecord] = deriveCodec

  object SalesforceErrorResponse {
    implicit val codec: Codec[SalesforceErrorResponse] = deriveCodec
    val expiredAuthenticationCode = "INVALID_SESSION_ID"
    val rateLimitExceeded = "REQUEST_LIMIT_EXCEEDED"
    val readOnlyMaintenance = "INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE"
  }

  case class SalesforceErrorResponse(
      message: String,
      errorCode: String,
  ) extends Throwable {

    val errorsToRetryUnlimited = List(
      SalesforceErrorResponse.expiredAuthenticationCode,
      SalesforceErrorResponse.rateLimitExceeded,
      SalesforceErrorResponse.readOnlyMaintenance,
    )

    def asRetryException: RetryException = if (errorsToRetryUnlimited.contains(errorCode))
      new RetryUnlimited(message, cause = this)
    else
      new RetryNone(message, cause = this)
  }

  object Authentication {
    import MillisDate.decodeDateTime
    implicit val codec: Decoder[Authentication] = deriveDecoder
  }

  case class Authentication(access_token: String, instance_url: String, issued_at: DateTime) {
    private val expiryTimeMinutes = 15

    def isFresh: Boolean = issued_at.isAfter(DateTime.now().minusMinutes(expiryTimeMinutes))
  }

  case class SfContactId(id: String)

}
