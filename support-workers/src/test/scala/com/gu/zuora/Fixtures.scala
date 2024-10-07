package com.gu.zuora

import com.gu.config.Configuration
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.stripe.StripeServiceForCurrency
import com.gu.support.acquisitions.ReferrerAcquisitionData
import com.gu.support.catalog
import com.gu.support.catalog.{Everyday, HomeDelivery, NationalDelivery}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.paperround.AgentId
import com.gu.support.workers._
import com.gu.support.zuora.api._
import org.joda.time.LocalDate
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{TouchPointEnvironment, ZuoraConfig}

//noinspection TypeAnnotation
object Fixtures {
  val accountNumber: String = "A00084679"

  val salesforceAccountId: String = "0013E00001ASmI6QAL"
  val salesforceId: String = "0033E00001CpBZaQAN"
  val identityId: String = "30000311"
  val tokenId: String = "card_Aaynm1dIeDH1zp"
  val secondTokenId: String = "cus_AaynKIp19IIGDz"
  val cardNumber: String = "4242"
  val payPalBaid: String = "B-23637766K5365543J"
  val deliveryAgentId: Int = 2532

  val date: LocalDate = new LocalDate(2017, 5, 4)

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

  val contactDetails: ContactDetails =
    ContactDetails("Test-FirstName", "Test-LastName", Some("test@thegulocal.com"), Country.UK)
  val differentContactDetails: ContactDetails = ContactDetails(
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
  val differentContactDetailsOutsideLondon: ContactDetails = ContactDetails(
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
  val creditCardPaymentMethod: PaymentGateway => CreditCardReferenceTransaction = CreditCardReferenceTransaction(
    tokenId,
    secondTokenId,
    cardNumber,
    Some(Country.UK),
    12,
    41,
    Some("AmericanExpress"),
    _: PaymentGateway,
    StripePaymentType = Some(StripePaymentType.StripeCheckout),
  )
  val payPalPaymentMethod: PayPalReferenceTransaction = PayPalReferenceTransaction(payPalBaid, "test@paypal.com")
  val directDebitPaymentMethod: DirectDebitPaymentMethod = DirectDebitPaymentMethod(
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
  )

  val config: ZuoraConfig = Configuration.load().zuoraConfigProvider.get()
  val monthlySubscriptionData: SubscriptionData = SubscriptionData(
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
  val blankReferrerAcquisitionData: ReferrerAcquisitionData =
    ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None)

  val touchpointEnvironment: TouchPointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage)
  val everydayHomeDeliveryProductRatePlanId: Option[ProductRatePlanId] =
    catalog.Paper.getProductRatePlan(touchpointEnvironment, Monthly, HomeDelivery, Everyday) map (_.id)
  val everydayNationalDeliveryProductRatePlanId: Option[ProductRatePlanId] =
    catalog.Paper.getProductRatePlan(touchpointEnvironment, Monthly, NationalDelivery, Everyday) map (_.id)

  val everydayPaperSubscriptionData: SubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(everydayHomeDeliveryProductRatePlanId.get),
        Nil,
        Nil,
      ),
    ),
    Subscription(date, date, date, "id123"),
  )

  val everydayNationalDeliveryPaperSubscriptionData: SubscriptionData = SubscriptionData(
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

  def directDebitSubscriptionRequest: SubscribeRequest =
    SubscribeRequest(
      List(
        SubscribeItem(
          account(paymentGateway = DirectDebitGateway),
          contactDetails,
          None,
          Some(directDebitPaymentMethod),
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
          Some(directDebitPaymentMethod),
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
          Some(directDebitPaymentMethod),
          everydayNationalDeliveryPaperSubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  val invalidMonthlySubsData: SubscriptionData = SubscriptionData(
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
  val invalidSubscriptionRequest: SubscribeRequest = SubscribeRequest(
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

  val incorrectPaymentMethod: SubscribeRequest = SubscribeRequest(
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
