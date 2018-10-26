package com.gu.support.workers.lambdas

import com.gu.i18n.Currency.GBP
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.AccountAccessScope._
import com.gu.support.workers.model.states.CreateZuoraSubscriptionState
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class CreateZuoraSubscriptionStateDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  def json(hasSession: Boolean): String =
    s"""{
          $requestIdJson,
          $userJson,
          "product": ${contribution(currency = GBP)},
          "paymentMethod": $payPalPaymentMethod,
          "salesForceContact": {
            "Id": "123",
            "AccountId": "123"
          }${
      if (hasSession) """,
          "sessionId": "testingToken""""
      else ""
    }
        }"""

  "CreateZuoraSubscriptionStateDecoder" should "be able to decode authenticated access scope" in {
    val maybeState = decode[CreateZuoraSubscriptionState](json(false))

    val fieldsToTest = maybeState.map(state =>
      state.accountAccessScope)
    fieldsToTest should be(Right(
      AuthenticatedAccess
    ))

  }

  it should "be able to decode session access scope" in {
    val maybeState = decode[CreateZuoraSubscriptionState](json(true))
    val fieldsToTest = maybeState.map(state =>
      state.accountAccessScope)
    fieldsToTest should be(Right(
      SessionAccess(SessionId("testingToken"))
    ))
  }

}
