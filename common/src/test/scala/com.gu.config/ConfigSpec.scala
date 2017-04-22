package com.gu.config
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class ConfigSpec extends FlatSpec with Matchers with LazyLogging {

  "Config" should "load correctly" in {
    Configuration.stage should be (Stages.DEV)
    val s = Configuration.stripeCredentials
    logger.info(s"Output: ${Configuration.stripeCredentials}")
    s.publicKey should be ("pk_test_Qm3CGRdrV4WfGYCpm0sftR0f")
  }
}
