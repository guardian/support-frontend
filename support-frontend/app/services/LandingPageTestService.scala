package services

import admin.settings.LandingPageTest
import com.gu.aws.AwsCloudWatchMetricSetup.getLandingPageTestsError
import com.gu.support.config.Stage
import org.apache.pekko.actor.ActorSystem

import scala.concurrent.ExecutionContext

trait LandingPageTestService {
  def getTests(): List[LandingPageTest]
}

/** A service for polling DynamoDB for landing page tests config
  */
class LandingPageTestServiceImpl(stage: Stage)(implicit ec: ExecutionContext, system: ActorSystem)
    extends ChannelTestService[LandingPageTest](
      stage,
      ChannelTestConfig(
        channelName = "SupportLandingPage",
        testTypeName = "landing page test",
        errorMetric = getLandingPageTestsError,
      ),
    )
    with LandingPageTestService {

  override protected def postProcess(tests: List[LandingPageTest]): List[LandingPageTest] =
    tests.sortBy(_.priority)
}
