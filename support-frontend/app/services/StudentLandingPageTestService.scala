package services

import admin.settings.StudentLandingPageTest
import com.gu.support.config.Stage
import scala.concurrent.ExecutionContext
import org.apache.pekko.actor.ActorSystem
import com.gu.aws.AwsCloudWatchMetricSetup.getStudentLandingPageTestsError

trait StudentLandingPageTestService {
  def getTests(): List[StudentLandingPageTest]
}

class StudentLandingPageTestServiceImpl(stage: Stage)(implicit ec: ExecutionContext, system: ActorSystem)
    extends ChannelTestService[StudentLandingPageTest](
      stage,
      ChannelTestConfig(
        channelName = "StudentLandingPage",
        testTypeName = "student landing page test",
        errorMetric = getStudentLandingPageTestsError,
      ),
    )
    with StudentLandingPageTestService {

  override protected def postProcess(tests: List[StudentLandingPageTest]): List[StudentLandingPageTest] =
    tests.sortBy(_.priority)
}
