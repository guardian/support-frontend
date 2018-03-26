package model.stripe

import com.stripe.model.Charge
import org.mockito.Mockito._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{Matchers, WordSpec}

class StripeChargeSuccessSpec extends WordSpec with Matchers with MockitoSugar {

  "StripeChargeSuccess" when {

    "created from a charge of 123 pence" should {
      "correctly convert to £1.23" in {
        val chargeMock: Charge = mock[Charge]
        when(chargeMock.getCurrency).thenReturn("GBP")
        when(chargeMock.getAmount).thenReturn(123L)
        val stripeChargeSuccess = StripeChargeSuccess.fromCharge(chargeMock)
        stripeChargeSuccess.amount shouldBe 1.23
      }

    }
  }
}
