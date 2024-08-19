package com.gu.support.zuora.api

import com.gu.i18n.Currency
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.JsonHelpers._
import io.circe.{Decoder, Encoder}

object Account {
  private val salesforceIdName = "sfContactId__c"
  implicit val encoder: Encoder[Account] =
    capitalizingEncoder[Account].mapJsonObject(_.renameField(salesforceIdName.capitalize, salesforceIdName))
  implicit val decoder: Decoder[Account] = decapitalizingDecoder[Account]
}

case class Account(
    name: String,
    currency: Currency,
    crmId: String, // Salesforce accountId
    sfContactId__c: String, // Salesforce contactId
    identityId__c: String,
    paymentGateway: Option[PaymentGateway],
    createdRequestId__c: String,
    billCycleDay: Int = 0,
    autoPay: Boolean = true,
    paymentTerm: String = "Due Upon Receipt",
    bcdSettingOption: String = "AutoSet",
    batch: String = "Batch1",
)
