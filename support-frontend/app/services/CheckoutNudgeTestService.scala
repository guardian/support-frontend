package services

import admin.settings.{CheckoutNudgeTest, LandingPageTest, Status}
import com.gu.aws.AwsCloudWatchMetricSetup.getCheckoutNudgeTestsError
import com.gu.support.config.Stage
import org.apache.pekko.actor.ActorSystem

import scala.concurrent.ExecutionContext

trait CheckoutNudgeTestService {
  def getTests(): List[CheckoutNudgeTest]
}

/** A service for polling DynamoDB for checkout nudge tests config
  */
class CheckoutNudgeTestServiceImpl(stage: Stage)(implicit
    ec: ExecutionContext,
    system: ActorSystem,
) extends ChannelTestService[CheckoutNudgeTest](
      stage,
      ChannelTestConfig(
        channelName = "CheckoutNudge",
        testTypeName = "checkout nudge test",
        errorMetric = getCheckoutNudgeTestsError,
      ),
    )
    with CheckoutNudgeTestService {
  override protected def postProcess(tests: List[CheckoutNudgeTest]): List[CheckoutNudgeTest] =
    tests.sortBy(_.priority)
}
