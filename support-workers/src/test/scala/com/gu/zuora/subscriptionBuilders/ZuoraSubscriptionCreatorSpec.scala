package com.gu.zuora

import com.gu.support.zuora.api.{Account, RatePlan, RatePlanData, SubscribeItem}
import com.gu.support.zuora.domain.DomainSubscription
import org.mockito.MockitoSugar.{times, verify, when}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock
import com.gu.support.zuora.api.response.{ZuoraAccountNumber, ZuoraSubscriptionNumber, RatePlan => ZuoraRatePlan}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito
import org.mockito.Mockito.{mock => mockitoMock}

import scala.concurrent.Future

class ZuoraSubscriptionCreatorSpec extends AnyFlatSpec with Matchers {

  /** These tests validate that the zuoraService.subscribe() should be skipped if there is an existing
    * domainSubscription and that subscription has matching rate plans
    */
  "subscribeIfApplicable" should "subscribe with no domainSubscription" in {
    val zuoraService = mock[ZuoraSubscribeService]
    val subscribeItem = mockitoMock(classOf[SubscribeItem], Mockito.RETURNS_DEEP_STUBS)
    val maybeDomainSubscription = None
    when(zuoraService.subscribe(any())).thenReturn(Future.successful(Nil))

    ZuoraSubscriptionCreator.subscribeIfApplicable(
      zuoraService = zuoraService,
      subscribeItem = subscribeItem,
      maybeDomainSubscription = maybeDomainSubscription,
    )

    verify(zuoraService, times(1)).subscribe(any())
  }

  "subscribeIfApplicable" should "subscribe with a domainSubscription and non-matching rate plans" in {
    val zuoraService = mock[ZuoraSubscribeService]
    val subscribeItem = mockitoMock(classOf[SubscribeItem], Mockito.RETURNS_DEEP_STUBS)
    val domainSubscription = mock[DomainSubscription]
    val maybeDomainSubscription = Option(domainSubscription)
    val ratePlanData = List(
      RatePlanData(RatePlan("id1"), Nil, Nil),
      RatePlanData(RatePlan("id2"), Nil, Nil),
      RatePlanData(RatePlan("id3"), Nil, Nil),
    )
    val zuoraRatePlans = List(
      ZuoraRatePlan("id1", "id1", "id1", Nil),
      ZuoraRatePlan("id2", "id2", "id2", Nil),
      // Here's the difference, `id4`
      ZuoraRatePlan("id3", "id3", "id4", Nil),
    )

    when(subscribeItem.subscriptionData.ratePlanData).thenReturn(ratePlanData)
    when(domainSubscription.ratePlans).thenReturn(zuoraRatePlans)
    when(zuoraService.subscribe(any())).thenReturn(Future.successful(Nil))

    ZuoraSubscriptionCreator.subscribeIfApplicable(
      zuoraService = zuoraService,
      subscribeItem = subscribeItem,
      maybeDomainSubscription = maybeDomainSubscription,
    )

    verify(zuoraService, times(1)).subscribe(any())
  }

  "subscribeIfApplicable" should "skip with a domainSubscription but matching rate plans" in {
    val zuoraService = mock[ZuoraSubscribeService]
    val subscribeItem = mockitoMock(classOf[SubscribeItem], Mockito.RETURNS_DEEP_STUBS)
    val domainSubscription = mock[DomainSubscription]
    val maybeDomainSubscription = Option(domainSubscription)
    val ratePlanData = List(
      RatePlanData(RatePlan("id1"), Nil, Nil),
      RatePlanData(RatePlan("id2"), Nil, Nil),
      RatePlanData(RatePlan("id3"), Nil, Nil),
    )
    val zuoraRatePlans = List(
      ZuoraRatePlan("id1", "id1", "id1", Nil),
      ZuoraRatePlan("id2", "id2", "id2", Nil),
      ZuoraRatePlan("id3", "id3", "id3", Nil),
    )

    when(subscribeItem.subscriptionData.ratePlanData).thenReturn(ratePlanData)
    when(domainSubscription.ratePlans).thenReturn(zuoraRatePlans)

    ZuoraSubscriptionCreator.subscribeIfApplicable(
      zuoraService = zuoraService,
      subscribeItem = subscribeItem,
      maybeDomainSubscription = maybeDomainSubscription,
    )

    verify(zuoraService, times(0)).subscribe(any())
  }
}
