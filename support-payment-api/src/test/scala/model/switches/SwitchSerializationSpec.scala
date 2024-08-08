package model.switches

import io.circe
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers
import io.circe.parser._
import services.SwitchState.On
import services.Switches

import scala.io.Source

class SwitchSerializationSpec extends AnyFlatSpec with Matchers {

  "switches_v2.json " should "load successfully" in {

    def loadSwitches: String = Source.fromURL(getClass.getResource("/switches_v2.json")).mkString
    val switches: Either[circe.Error, Switches] = decode[Switches](loadSwitches)
    switches.isRight mustBe true
    switches.map(switch =>
      switch.recaptchaSwitches.map(recaptchaSwitch => recaptchaSwitch.switches.enableRecaptchaBackend.state mustBe On),
    )
    switches.map(switch =>
      switch.oneOffPaymentMethods.map(oneOffPaymentSwitch => oneOffPaymentSwitch.switches.stripe mustBe None),
    )
    switches.map(switch =>
      switch.oneOffPaymentMethods.map(oneOffPaymentSwitch => oneOffPaymentSwitch.switches.payPal.state mustBe On),
    )
  }

}
