package com.gu.zuora

import com.gu.config.Configuration
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.stripe.StripeServiceForAccount
import com.gu.support.acquisitions.ReferrerAcquisitionData
import com.gu.support.catalog
import com.gu.support.catalog.{Everyday, HomeDelivery, NationalDelivery}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.paperround.AgentId
import com.gu.support.workers._
import com.gu.support.zuora.api._
import org.joda.time.LocalDate

//noinspection TypeAnnotation
object Fixtures {
  val accountNumber = "A00084679"

  val salesforceAccountId = "0013E00001ASmI6QAL"
  val salesforceId = "0033E00001CpBZaQAN"
  val identityId = "30000311"
  val tokenId = "card_Aaynm1dIeDH1zp"
  val secondTokenId = "cus_AaynKIp19IIGDz"
  val payPalBaid = "B-23637766K5365543J"
  val deliveryAgentId = 2532

  val date = new LocalDate(2017, 5, 4)

  def account(
      currency: Currency = GBP,
      paymentGateway: PaymentGateway = StripeGatewayDefault,
  ): Account = Account(
    name = salesforceAccountId,
    currency = currency,
    crmId = salesforceAccountId,
    sfContactId__c = salesforceId,
    identityId__c = identityId,
    paymentGateway = Some(paymentGateway),
    createdRequestId__c = "createdreqid_hi",
  )

  val contactDetails = ContactDetails("Test-FirstName", "Test-LastName", Some("test@thegulocal.com"), Country.UK)
  val differentContactDetails = ContactDetails(
    "Test-FirstName",
    "from support-frontend integration tests",
    Some("test@thegulocal.com"),
    Country.UK,
    Some("123 easy street"),
    None,
    Some("london"),
    Some("n1 9gu"),
    None,
    Some("Leave with neighbour - support-frontend"),
  )
  val differentContactDetailsOutsideLondon = ContactDetails(
    "Test-FirstName",
    "from support-frontend integration tests",
    Some("test@thegulocal.com"),
    Country.UK,
    Some("4 Hackins Hey"),
    None,
    Some("Liverpool"),
    Some("L2 2AW"),
    None,
    Some("Leave with neighbour - support-frontend"),
  )
  val creditCardPaymentMethod = CreditCardReferenceTransaction(
    tokenId,
    secondTokenId,
    _: PaymentGateway,
    StripePaymentType = Some(StripePaymentType.StripeCheckout),
  )
  val payPalPaymentMethod = PayPalReferenceTransaction(payPalBaid, "test@paypal.com")
  def directDebitPaymentMethod(paymentGateway: PaymentGateway = DirectDebitGateway): DirectDebitPaymentMethod =
    DirectDebitPaymentMethod(
      "Barry",
      "Humphreys",
      "Barry Humphreys",
      "200000",
      "55779911",
      City = Some("Edited city"),
      PostalCode = Some("n19gu"),
      State = Some("blah"),
      StreetName = Some("easy street"),
      StreetNumber = Some("123"),
      PaymentGateway = paymentGateway,
    )

  val config = Configuration.load().zuoraConfigProvider.get()
  val monthlySubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(config.monthlyContribution.productRatePlanId), // Contribution product
        List(
          RatePlanChargeData(
            RatePlanChargeOverride(config.monthlyContribution.productRatePlanChargeId, 25),
          ),
        ),
        Nil,
      ),
    ),
    Subscription(date, date, date, "id123"),
  )
  val blankReferrerAcquisitionData =
    ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None)

  val touchpointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage)
  val everydayHomeDeliveryProductRatePlanId =
    catalog.Paper.getProductRatePlan(touchpointEnvironment, Monthly, HomeDelivery, Everyday) map (_.id)
  val everydayNationalDeliveryProductRatePlanId =
    catalog.Paper.getProductRatePlan(touchpointEnvironment, Monthly, NationalDelivery, Everyday) map (_.id)

  val everydayPaperSubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(everydayHomeDeliveryProductRatePlanId.get),
        Nil,
        Nil,
      ),
    ),
    Subscription(date, date, date, "id123"),
  )

  val everydayNationalDeliveryPaperSubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(everydayNationalDeliveryProductRatePlanId.get),
        Nil,
        Nil,
      ),
    ),
    Subscription(date, date, date, "id123", deliveryAgent = Some(AgentId(deliveryAgentId))),
  )

  def creditCardSubscriptionRequest(
      currency: Currency = GBP,
      paymentIntentGateway: PaymentGateway = StripeGatewayPaymentIntentsDefault,
  ): SubscribeRequest =
    SubscribeRequest(
      List(
        SubscribeItem(
          account(currency),
          contactDetails,
          None,
          Some(creditCardPaymentMethod(paymentIntentGateway)),
          monthlySubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  def directDebitSubscriptionRequest(paymentGateway: PaymentGateway): SubscribeRequest =
    SubscribeRequest(
      List(
        SubscribeItem(
          account(paymentGateway = paymentGateway),
          contactDetails,
          None,
          Some(directDebitPaymentMethod()),
          monthlySubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  def directDebitSubscriptionRequestPaper: SubscribeRequest =
    SubscribeRequest(
      List(
        SubscribeItem(
          account(paymentGateway = DirectDebitGateway),
          contactDetails,
          Some(differentContactDetails),
          Some(directDebitPaymentMethod()),
          everydayPaperSubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  def directDebitSubscriptionRequestNationalDelivery: SubscribeRequest =
    SubscribeRequest(
      List(
        SubscribeItem(
          account(paymentGateway = DirectDebitGateway),
          contactDetails,
          Some(differentContactDetailsOutsideLondon),
          Some(directDebitPaymentMethod()),
          everydayNationalDeliveryPaperSubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  val invalidMonthlySubsData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(config.monthlyContribution.productRatePlanId),
        List(
          RatePlanChargeData(
            RatePlanChargeOverride(config.monthlyContribution.productRatePlanChargeId, 5),
          ),
        ),
        Nil,
      ),
    ),
    Subscription(date, date, date, "id123", termType = "Invalid term type"),
  )
  val invalidSubscriptionRequest = SubscribeRequest(
    List(
      SubscribeItem(
        account(),
        contactDetails,
        None,
        Some(creditCardPaymentMethod(StripeGatewayDefault)),
        invalidMonthlySubsData,
        SubscribeOptions(),
      ),
    ),
  )

  val incorrectPaymentMethod = SubscribeRequest(
    List(
      SubscribeItem(
        account(),
        contactDetails,
        None,
        Some(payPalPaymentMethod),
        invalidMonthlySubsData,
        SubscribeOptions(),
      ),
    ),
  )

}
