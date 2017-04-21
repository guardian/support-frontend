package com.gu.config
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class ConfigSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "Config" should "load correctly" in {
    val s = Configuration.stripeCredentials
    logger.info(s"Output: ${Configuration.stripeCredentials}")
  }


}
