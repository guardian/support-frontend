package com.gu.zuora.subscriptionBuilders

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{EverydayPlus, HomeDelivery, NationalDelivery, Sunday}
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.JsonFixtures.{
  salesforceContact,
  stripePaymentMethodObj,
  userJsonWithDeliveryAddress,
  userJsonWithDeliveryAddressOutsideLondon,
}
import com.gu.support.workers.{Paper, ProductInformation}
import com.gu.support.workers.exceptions.BadRequestException
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.PaperState
import com.gu.support.zuora.api.{DirectDebitTortoiseMediaGateway, StripeTortoiseMedia}
import com.gu.zuora.Fixtures.directDebitPaymentMethod
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock

import java.util.UUID

class PaperSubscriptionBuilderSpec extends AnyFlatSpec with Matchers {
  val date = new LocalDate(2020, 6, 15)
  "National Delivery subscriptions" must "have a delivery agent" in {
    val product = Paper(
      fulfilmentOptions = NationalDelivery,
      productOptions = EverydayPlus,
      deliveryAgent = None,
    )
    val userObject = userJsonWithDeliveryAddressOutsideLondon
    val state = PaperState(
      product = product,
      productInformation = None,
      firstDeliveryDate = LocalDate.now(),
      appliedPromotion = None,
      user = userObject,
      paymentMethod = stripePaymentMethodObj,
      salesForceContact = salesforceContact,
      similarProductsConsent = None,
    )
    val builder = new PaperSubscriptionBuilder(
      mock[PromotionService],
      CODE,
      new SubscribeItemBuilder(UUID.randomUUID(), userObject, GBP, date),
    )

    assertThrows[BadRequestException] {
      builder.build(
        state,
        csrUsername = None,
        salesforceCaseId = None,
      )
    }
  }
  private val userObject = userJsonWithDeliveryAddress
  private val builder = new PaperSubscriptionBuilder(
    mock[PromotionService],
    CODE,
    new SubscribeItemBuilder(UUID.randomUUID(), userObject, GBP, date),
  )

  "Sunday subscriptions" must "use the Tortoise payment gateways" in {
    val product = Paper(
      fulfilmentOptions = HomeDelivery,
      productOptions = Sunday,
      deliveryAgent = None,
    )
    val stripeState = PaperState(
      product = product,
      productInformation = None,
      firstDeliveryDate = LocalDate.now(),
      appliedPromotion = None,
      user = userObject,
      paymentMethod = stripePaymentMethodObj,
      salesForceContact = salesforceContact,
      similarProductsConsent = None,
    )
    val directDebitState = stripeState.copy(
      paymentMethod = directDebitPaymentMethod(),
    )

    assertThrows[BadRequestException] {
      builder.build(
        stripeState,
        csrUsername = None,
        salesforceCaseId = None,
      )
    }

    assertThrows[BadRequestException] {
      builder.build(
        directDebitState,
        csrUsername = None,
        salesforceCaseId = None,
      )
    }
  }
  "Other subscriptions" must "not use the Tortoise payment gateways" in {
    val product = Paper(
      fulfilmentOptions = HomeDelivery,
      productOptions = EverydayPlus,
      deliveryAgent = None,
    )
    val stripeState = PaperState(
      product = product,
      productInformation = None,
      firstDeliveryDate = LocalDate.now(),
      appliedPromotion = None,
      user = userObject,
      paymentMethod = stripePaymentMethodObj.copy(PaymentGateway = StripeTortoiseMedia),
      salesForceContact = salesforceContact,
      similarProductsConsent = None,
    )
    val directDebitState = stripeState.copy(
      paymentMethod = directDebitPaymentMethod().copy(PaymentGateway = DirectDebitTortoiseMediaGateway),
    )

    assertThrows[BadRequestException] {
      builder.build(
        stripeState,
        csrUsername = None,
        salesforceCaseId = None,
      )
    }

    assertThrows[BadRequestException] {
      builder.build(
        directDebitState,
        csrUsername = None,
        salesforceCaseId = None,
      )
    }
  }
  "Correctly configured subscriptions" must "not throw an exception" in {
    val product = Paper(
      fulfilmentOptions = HomeDelivery,
      productOptions = EverydayPlus,
      deliveryAgent = None,
    )
    val stripeState = PaperState(
      product = product,
      productInformation = None,
      firstDeliveryDate = LocalDate.now(),
      appliedPromotion = None,
      user = userObject,
      paymentMethod = stripePaymentMethodObj,
      salesForceContact = salesforceContact,
      similarProductsConsent = None,
    )
    val directDebitState = stripeState.copy(
      paymentMethod = directDebitPaymentMethod(),
    )

    builder.build(
      stripeState,
      csrUsername = None,
      salesforceCaseId = None,
    )

    builder.build(
      directDebitState,
      csrUsername = None,
      salesforceCaseId = None,
    )
  }
}
