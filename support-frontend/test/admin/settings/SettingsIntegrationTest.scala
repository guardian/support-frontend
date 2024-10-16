package admin.settings

import com.gu.aws.AwsS3Client
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.config.{ConfigFactory, ConfigValue, ConfigValueFactory}
import com.typesafe.scalalogging.StrictLogging
import config.Configuration
import org.apache.pekko.actor.ActorSystem
import org.mockito.Mockito.spy
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.libs.ws.WSClient

import java.nio.file.{Files, Paths}
import java.io.File
@IntegrationTest
class SettingsIntegrationTest extends AsyncFlatSpec with Matchers with StrictLogging {
  "Settings" should "load successfully" in {
    implicit val s3Client: AwsS3Client = AwsS3Client
    implicit val actorSystem = ActorSystem("test")
    implicit val implicitWs: WSClient = mock[WSClient]

    val confFile = s"${System.getProperty("user.dir")}/support-frontend/conf/CODE.public.conf"

    Files.exists(Paths.get(confFile)) shouldBe true
    val typesafeConfig = ConfigFactory.parseFile(new File(confFile))

    val configuration = new Configuration(typesafeConfig)

    val maybeAllSettings = for {
      allSettingsProvider <- AllSettingsProvider.fromConfig(configuration)
      allSettings = allSettingsProvider.getAllSettings()
    } yield allSettings

    maybeAllSettings.right.get shouldBe 11

  }
}
