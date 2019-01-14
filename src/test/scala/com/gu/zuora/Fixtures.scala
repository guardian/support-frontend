package com.gu.zuora

import com.gu.config.Configuration
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers.{CreditCardReferenceTransaction, DirectDebitPaymentMethod, PayPalReferenceTransaction}
import com.gu.support.zuora.api._
import org.joda.time.LocalDate

//noinspection TypeAnnotation
object Fixtures {
  val accountNumber = "A00071408"

  val salesforceAccountId = "001g000001gPmXdAAK"
  val salesforceId = "003g000001UtkrEAAR"
  val identityId = "30000311"
  val tokenId = "card_Aaynm1dIeDH1zp"
  val secondTokenId = "cus_AaynKIp19IIGDz"
  val cardNumber = "4242"
  val payPalBaid = "B-23637766K5365543J"

  val date = new LocalDate(2017, 5, 4)

  def account(
    currency: Currency = GBP,
    paymentGateway: PaymentGateway = StripeGatewayDefault
  ): Account = Account(
    salesforceAccountId,
    currency,
    salesforceAccountId,
    salesforceId,
    identityId,
    paymentGateway,
    "createdreqid_hi"
  )

  val contactDetails = ContactDetails("Test-FirstName", "Test-LastName", "test@gu.com", Country.UK)
  val creditCardPaymentMethod = CreditCardReferenceTransaction(tokenId, secondTokenId, cardNumber, Some(Country.UK), 12, 22, "AmericanExpress")
  val payPalPaymentMethod = PayPalReferenceTransaction(payPalBaid, "test@paypal.com")
  val directDebitPaymentMethod = DirectDebitPaymentMethod("Barry", "Humphreys", "Barry Humphreys", "200000", "55779911")

  val config = Configuration.zuoraConfigProvider.get()
  val monthlySubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(config.monthlyContribution.productRatePlanId), //Contribution product
        List(RatePlanChargeData(
          ContributionRatePlanCharge(config.monthlyContribution.productRatePlanChargeId, 25)
        )),
        Nil
      )
    ),
    Subscription(date, date, date)
  )

  def previewRequest(currency: Currency = GBP): PreviewSubscribeRequest = PreviewSubscribeRequest(
    List(
      PreviewSubscribeItem(
        account(currency),
        contactDetails,
        creditCardPaymentMethod,
        monthlySubscriptionData,
        SubscribeOptions(),
        PreviewOptions(numberOfPeriods = 3)
      )
    )
  )

  def creditCardSubscriptionRequest(currency: Currency = GBP): SubscribeRequest =
    SubscribeRequest(List(
      SubscribeItem(account(currency), contactDetails, creditCardPaymentMethod, monthlySubscriptionData, SubscribeOptions())
    ))

  def directDebitSubscriptionRequest: SubscribeRequest =
    SubscribeRequest(List(
      SubscribeItem(account(paymentGateway = DirectDebitGateway), contactDetails, directDebitPaymentMethod, monthlySubscriptionData, SubscribeOptions())
    ))

  val invalidMonthlySubsData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(config.monthlyContribution.productRatePlanId),
        List(RatePlanChargeData(
          ContributionRatePlanCharge(config.monthlyContribution.productRatePlanChargeId, 5)
        )),
        Nil
      )
    ),
    Subscription(date, date, date, termType = "Invalid term type")
  )
  val invalidSubscriptionRequest = SubscribeRequest(List(
    SubscribeItem(account(), contactDetails, creditCardPaymentMethod, invalidMonthlySubsData, SubscribeOptions())
  ))

  val incorrectPaymentMethod = SubscribeRequest(List(SubscribeItem(account(), contactDetails, payPalPaymentMethod, invalidMonthlySubsData, SubscribeOptions())))

}
