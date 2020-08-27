package model.stripe

import com.stripe.model.Charge
import org.mockito.Mockito._
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

class StripeChargeSuccessSpec extends AnyWordSpec with Matchers with MockitoSugar {

  "StripeChargeSuccess" when {

    "created from a charge of 123 pence" should {
      "correctly convert to £1.23" in {
        val chargeMock: Charge = mock[Charge]
        when(chargeMock.getCurrency).thenReturn("GBP")
        when(chargeMock.getAmount).thenReturn(123L)
        val stripeChargeSuccess = StripeCreateChargeResponse.fromCharge(chargeMock, None)
        stripeChargeSuccess.amount mustBe 1.23
      }

    }
  }
}
