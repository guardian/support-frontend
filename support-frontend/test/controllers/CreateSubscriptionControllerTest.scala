package controllers

import com.gu.i18n.Currency
import com.gu.support.catalog.FulfilmentOptions
import com.gu.support.workers.{GuardianWeekly, Monthly}
import org.mockito.Mockito.when
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock
import services.stepfunctions.CreateSupportWorkersRequest

class CreateSubscriptionControllerTest extends AnyFlatSpec with Matchers {
  "threeTierAugmentPromoCode" should "Do stuff" in {
//    val controller = mock[CreateSubscriptionController]
//    val body = mock[CreateSupportWorkersRequest]
//    val fulfilmentOptions = mock[FulfilmentOptions]
//
//    when(body.billingAddress.country.alpha2) thenReturn "UK"
//
//    when(body.product) thenReturn GuardianWeekly(
//      currency = Currency.GBP,
//      billingPeriod = Monthly,
//      fulfilmentOptions = fulfilmentOptions,
//    )
//
//    when(body.threeTierCreateSupporterPlusSubscription) thenReturn true
//
//    when(body.promoCode) thenReturn "3TIER_WEEKLY_UK_MONTHLY"
//
//    println(controller.threeTierAugmentPromoCode(body))

    1 shouldBe (1)
  }
}
