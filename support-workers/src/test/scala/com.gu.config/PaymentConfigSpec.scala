package com.gu.config

import com.gu.i18n.Currency.AUD
import com.gu.support.config.Stages
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class PaymentConfigSpec extends AnyFlatSpec with Matchers with LazyLogging {

  "Config" should "load correctly" in {
    val config = Configuration.load()
    Configuration.stage should be(Stages.DEV)

    val stripeDefault = config.stripeConfigProvider.get().forCurrency(None)
    stripeDefault.publicKey should be("pk_test_Qm3CGRdrV4WfGYCpm0sftR0f")
    stripeDefault.secretKey.length should be > 0

    val stripeAustralia = config.stripeConfigProvider.get().forCurrency(Some(AUD))
    stripeAustralia.publicKey should be("pk_test_m0sjR1tGM22fpaz48csa49us")
    stripeAustralia.secretKey.length should be > 0

    // This won't work on TeamCity unless we add the version into reference.conf in support-config
    // config.stripeConfigProvider.get().version should be(Some("2017-08-15"))

    val p = config.payPalConfigProvider.get()
    p.NVPVersion should be("124.0")
    p.signature.length should be > 0

    val z = config.zuoraConfigProvider.get()
    z.url should be("https://rest.apisandbox.zuora.com/v1")

  }
}
