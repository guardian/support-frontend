package com.gu.support.encoding

import com.gu.support.SerialisationTestHelpers
import com.gu.support.encoding.Codec._
import com.gu.support.workers.{ClonedDirectDebitPaymentMethod, DirectDebitPaymentMethod, PaymentMethod}
import com.typesafe.scalalogging.LazyLogging
import io.circe._
import org.scalatest.{FlatSpec, Matchers}

class PaymentMethodEncoderSpec extends FlatSpec with Matchers with LazyLogging with SerialisationTestHelpers {

  it should "correctly decode DirectDebitPaymentMethod" in {
    val json = s"""{
      "FirstName" : "Direct Debit",
      "LastName" : "Contribution",
      "BankTransferAccountName" : "post_multiple_changes",
      "BankCode" : "200000",
      "BankTransferAccountNumber" : "****9911",
      "Country" : "GB",
      "City" : null,
      "PostalCode" : null,
      "State" : null,
      "StreetName" : null,
      "StreetNumber" : null,
      "BankTransferType" : "DirectDebitUK",
      "Type" : "BankTransfer"
    }"""

    testDecoding[PaymentMethod](json, {case _: DirectDebitPaymentMethod => succeed})
  }

  it should "decode ClonedDirectDebitPaymentMethod" in {
    val json = s"""{
      "ExistingMandate" : "Yes",
      "TokenId" : "MD0005JW05SG7J",
      "MandateId" : "N2PCACP",
      "FirstName" : "Direct Debit",
      "LastName" : "Contribution",
      "BankTransferAccountName" : "post_multiple_changes",
      "BankCode" : "200000",
      "BankTransferAccountNumber" : "00009911",
      "Country" : "GB",
      "BankTransferType" : "DirectDebitUK",
      "Type" : "BankTransfer"
    }"""

    testDecoding[PaymentMethod](json, {case _: ClonedDirectDebitPaymentMethod => succeed})
  }

}
