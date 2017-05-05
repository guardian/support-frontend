package com.gu.zuora

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.zuora.model._
import org.joda.time.LocalDate

object Fixtures {
  val accountNumber = "A00015760"

  val getAccountResponse =
    """{
                               "basicInfo" : {
                                 "id" : "2c92c0f85bae511e015bcf31cde61532",
                                 "name" : "001g000001gPV73AAG",
                                 "accountNumber" : "A00015760",
                                 "notes" : null,
                                 "status" : "Active",
                                 "crmId" : "001g000001gPV73AAG",
                                 "batch" : "Batch1",
                                 "invoiceTemplateId" : "2c92c0f849369b8801493bf7db7e450e",
                                 "communicationProfileId" : null,
                                 "IdentityId__c" : "30000291",
                                 "sfContactId__c" : "003g000001UtN1qAAF",
                                 "CCURN__c" : null
                               },
                               "billingAndPayment" : {
                                 "billCycleDay" : 3,
                                 "currency" : "GBP",
                                 "paymentTerm" : "Due Upon Receipt",
                                 "paymentGateway" : "Stripe Gateway 1",
                                 "invoiceDeliveryPrefsPrint" : false,
                                 "invoiceDeliveryPrefsEmail" : false,
                                 "additionalEmailAddresses" : [ ]
                               },
                               "metrics" : {
                                 "balance" : 0E-9,
                                 "totalInvoiceBalance" : 0E-9,
                                 "creditBalance" : 0E-9,
                                 "contractedMrr" : 4.250000000
                               },
                               "billToContact" : {
                                 "address1" : "Test",
                                 "address2" : "TEst",
                                 "city" : "Test",
                                 "country" : "United Kingdom",
                                 "county" : null,
                                 "fax" : null,
                                 "firstName" : "Test",
                                 "homePhone" : null,
                                 "lastName" : "Test",
                                 "mobilePhone" : null,
                                 "nickname" : null,
                                 "otherPhone" : null,
                                 "otherPhoneType" : null,
                                 "personalEmail" : null,
                                 "state" : "Test",
                                 "taxRegion" : null,
                                 "workEmail" : "test@foo.com",
                                 "workPhone" : null,
                                 "zipCode" : "T223EST",
                                 "SpecialDeliveryInstructions__c" : null
                               },
                               "soldToContact" : {
                                 "address1" : "Test",
                                 "address2" : "TEst",
                                 "city" : "Test",
                                 "country" : "United Kingdom",
                                 "county" : null,
                                 "fax" : null,
                                 "firstName" : "Test",
                                 "homePhone" : null,
                                 "lastName" : "Test",
                                 "mobilePhone" : null,
                                 "nickname" : null,
                                 "otherPhone" : null,
                                 "otherPhoneType" : null,
                                 "personalEmail" : null,
                                 "state" : "Test",
                                 "taxRegion" : null,
                                 "workEmail" : "test@foo.com",
                                 "workPhone" : null,
                                 "zipCode" : "T223EST",
                                 "SpecialDeliveryInstructions__c" : null
                               },
                               "taxInfo" : null,
                               "success" : true
                             }"""

  val salesforceAccountId = "001g000001gPmXdAAK"
  val salesforceId = "003g000001UtkrEAAR"
  val identityId = "30000311"
  val paymentGateway = "Stripe Gateway 1"
  val tokenId = "card_Aaynm1dIeDH1zp"
  val secondTokenId = "cus_AaynKIp19IIGDz"
  val cardNumber = "4242"
  val payPalBaid = "B-23637766K5365543J"
  val date = new LocalDate(2017, 5, 4)
  val ProductRatePlanId = "2c92c0f85ab269be015acd9d014549b7"
  val ProductRatePlanChargeId = "2c92c0f85ab2696b015acd9eeb6150ab"

  val account = Account(salesforceAccountId, GBP, salesforceAccountId, salesforceId, identityId, StripeGateway)
  val contactDetails = ContactDetails("Test-FirstName", "Test-LastName", "test@gu.com", Country.UK)
  val creditCardPaymentMethod = CreditCardReferenceTransaction(tokenId, secondTokenId, cardNumber, Some(Country.UK), 12, 22, "Visa")
  val payPalPaymentMethod = PayPalPaymentMethod(payPalBaid, "test@paypal.com")

  val subscriptionData = SubscriptionData(List(
    RatePlanData(
      RatePlan(ProductRatePlanId),
      List(RatePlanChargeData(
        RatePlanCharge(ProductRatePlanChargeId, Some(5: BigDecimal))
      )),
      Nil
    )),
    Subscription(date, date, date)
  )

  val subscriptionRequest = SubscribeRequest(List(SubscribeItem(account, contactDetails, creditCardPaymentMethod, subscriptionData, SubscribeOptions())))

}


