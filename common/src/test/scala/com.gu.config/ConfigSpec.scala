package com.gu.config

import com.gu.i18n.Currency.AUD
import com.gu.support.config.Stages
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class ConfigSpec extends FlatSpec with Matchers with LazyLogging {

  "Config" should "load correctly" in {
    Configuration.stage should be(Stages.DEV)

    val stripeDefault = Configuration.stripeConfigProvider.get().forCurrency()
    stripeDefault.publicKey should be("pk_test_Qm3CGRdrV4WfGYCpm0sftR0f")
    stripeDefault.secretKey.length should be > 0

    val stripeAustralia = Configuration.stripeConfigProvider.get().forCurrency(Some(AUD))
    stripeAustralia.publicKey should be("pk_test_m0sjR1tGM22fpaz48csa49us")
    stripeAustralia.secretKey.length should be > 0

    //This won't work on TeamCity unless we add the version into reference.conf in support-config
    //Configuration.stripeConfigProvider.get().version should be(Some("2017-08-15"))

    val p = Configuration.payPalConfigProvider.get()
    p.NVPVersion should be("124.0")
    p.signature.length should be > 0

    val z = Configuration.zuoraConfigProvider.get()
    z.url should be("https://rest.apisandbox.zuora.com/v1")

    val e = Configuration.emailServicesConfig
    e.thankYou.queueName should be("contributions-thanks-dev")
    e.thankYou.dataExtensionName should be("regular-contribution-thank-you")
    e.failed.queueName should be("contributions-thanks-dev")
    e.failed.dataExtensionName should be("contribution-failed")
  }
}
