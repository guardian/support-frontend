package com.gu.zuora.model

import com.gu.i18n.Currency
import com.gu.zuora.encoding.CapitalizationEncoder._
import io.circe.{Decoder, Encoder}
import com.gu.zuora.encoding.CustomCodecs._

object Account {
  implicit val encoder: Encoder[Account] = capitalizingEncoder[Account].mapJsonObject(modifyFields(_)(decapitalizeSfContactId))
  implicit val decoder: Decoder[Account] = decapitalizingDecoder[Account]
}
case class Account(
  name: String,
  currency: Currency,
  crmId: String, //Salesforce accountId
  sfContactId__c: String, //Salesforce contactId - if this field name changes then change the encoder in CustomCodecs
  identityId__c: String,
  paymentGateway: PaymentGateway,
  billCycleDay: Int = 0,
  autoPay: Boolean = true,
  paymentTerm: String = "Due Upon Receipt",
  bcdSettingOption: String = "AutoSet",
  batch: String = "Batch1"
)