package com.gu.zuora.subscriptionBuilders

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{EverydayPlus, NationalDelivery}
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.JsonFixtures.{salesforceContact, stripePaymentMethodObj, user, userJsonWithDeliveryAddressOutsideLondon}
import com.gu.support.workers.{Paper, User}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.PaperState
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock

import java.util.UUID


class PaperSubscriptionBuilderSpec extends AnyFlatSpec with Matchers {
  "National Delivery subscriptions" must "have a delivery agent" in {
    assertThrows[IllegalArgumentException] {
      val product = Paper(
        fulfilmentOptions = NationalDelivery,
        productOptions = EverydayPlus,
        deliveryAgent = None,
      )
      val userObject  = userJsonWithDeliveryAddressOutsideLondon
      val state = PaperState(
        product = product,
        firstDeliveryDate = LocalDate.now(),
        appliedPromotion = None,
        user = userObject,
        paymentMethod = stripePaymentMethodObj,
        salesForceContact = salesforceContact,
        similarProductsConsent = None,
      )
      new PaperSubscriptionBuilder(
        mock[PromotionService],
        CODE,
        new SubscribeItemBuilder(UUID.randomUUID(), userObject, GBP),
      ).build(
        state,
        csrUsername = None,
        salesforceCaseId = None,
      )
    }
  }
}
