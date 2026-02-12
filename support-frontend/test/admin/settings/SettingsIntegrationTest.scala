package admin.settings

import com.gu.aws.AwsS3Client
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.config.{ConfigFactory, ConfigValue, ConfigValueFactory}
import com.typesafe.scalalogging.StrictLogging
import config.Configuration
import org.apache.pekko.actor.ActorSystem
import org.mockito.ArgumentMatchers.matches
import org.mockito.Mockito.spy
import org.scalatest.EitherValues
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.libs.ws.WSClient
import services.{CheckoutNudgeTestService, LandingPageTestService, OneTimeCheckoutTestService}

import java.nio.file.{Files, Paths}
import java.io.File
@IntegrationTest
class SettingsIntegrationTest extends AsyncFlatSpec with Matchers with StrictLogging with EitherValues {
  "Settings" should "load successfully" in {
    implicit val s3Client: AwsS3Client = AwsS3Client
    implicit val actorSystem = ActorSystem("test")
    implicit val implicitWs: WSClient = mock[WSClient]

    val confFile = s"${System.getProperty("user.dir")}/support-frontend/conf/CODE.public.conf"

    Files.exists(Paths.get(confFile)) shouldBe true
    val typesafeConfig = ConfigFactory.parseFile(new File(confFile))

    val configuration = new Configuration(typesafeConfig)

    val mockLandingPageTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
    }

    val mockCheckoutNudgeTestService = new CheckoutNudgeTestService {
      def getTests(): List[CheckoutNudgeTest] = Nil
    }

    val mockOneTimeCheckoutTestService = new OneTimeCheckoutTestService {
      def getTests(): List[OneTimeCheckoutTest] = Nil
    }

    val mockStudentLandingPageTestService = new StudentLandingPageTestService {
      def getTests(): List[StudentLandingPageTestService] = Nil
    }

    val maybeAllSettings = for {
      allSettingsProvider <- AllSettingsProvider.fromConfig(
        configuration,
        mockLandingPageTestService,
        mockCheckoutNudgeTestService,
        mockOneTimeCheckoutTestService,
        mockStudentLandingPageTestService,
      )
      allSettings = allSettingsProvider.getAllSettings()
    } yield allSettings

    maybeAllSettings match {
      case Left(e: Throwable) => fail(e.getMessage)
      case Left(_) => fail("Unknown error")
      case Right(_) => succeed
    }

    maybeAllSettings.value.amounts.length shouldBe 10

  }
}
