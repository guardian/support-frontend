package config

import com.gu.support.config.Stages
import com.typesafe.config.ConfigFactory
import io.circe.Json
import io.circe.syntax._
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class MParticleConversionsConfigProviderTest extends AnyWordSpec with Matchers {
  private val configured = ConfigFactory.parseString("""
    mparticle.web.apiKey = "web-conversions-test-key"
    mparticle.clientSecret = "private-server-credential"
  """)

  "MParticleConversionsConfigProvider" should {
    "leave browser conversions unconfigured when the public key is missing or blank" in {
      Seq(ConfigFactory.empty(), ConfigFactory.parseString("""mparticle.web.apiKey = "  " """)).foreach { config =>
        new MParticleConversionsConfigProvider(config, Stages.DEV).get(false) mustBe None
      }
    }

    "use development mode outside production and for production test users" in {
      Seq(
        (Stages.DEV, false, true),
        (Stages.CODE, false, true),
        (Stages.PROD, false, false),
        (Stages.PROD, true, true),
      ).foreach { case (stage, isTestUser, expectedDevelopmentMode) =>
        new MParticleConversionsConfigProvider(configured, stage).get(isTestUser) mustBe Some(
          MParticleConversionsConfig("web-conversions-test-key", expectedDevelopmentMode),
        )
      }
    }

    "serialize only the browser key and SDK environment" in {
      val browserConfig = new MParticleConversionsConfigProvider(configured, Stages.PROD).get(false)

      browserConfig.asJson mustBe Json.obj(
        "apiKey" -> Json.fromString("web-conversions-test-key"),
        "isDevelopmentMode" -> Json.False,
      )
    }
  }
}
