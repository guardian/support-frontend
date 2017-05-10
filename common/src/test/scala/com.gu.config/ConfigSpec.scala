package com.gu.config
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class ConfigSpec extends FlatSpec with Matchers with LazyLogging {

  "Config" should "load correctly" in {
    Configuration.stage should be (Stages.DEV)

    val s = Configuration.stripeConfig
    logger.info(s"Output: $s")
    s.publicKey should be ("pk_test_Qm3CGRdrV4WfGYCpm0sftR0f")
    s.secretKey.length should be > 0

    val p = Configuration.payPalConfig
    logger.info(s"Output: $p")
    p.NVPVersion should be ("124.0")
    p.signature.length should be > 0

    val e = Configuration.emailServicesConfig
    logger.info(s"Output: $e")
    e.thankYouEmailQueue should be ("contributions-thanks-dev")
  }
}
