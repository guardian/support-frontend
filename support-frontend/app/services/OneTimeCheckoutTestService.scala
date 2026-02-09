package services

import admin.settings.OneTimeCheckoutTest
import com.gu.aws.AwsCloudWatchMetricSetup.getOneTimeCheckoutTestsError
import com.gu.support.config.Stage
import org.apache.pekko.actor.ActorSystem

import scala.concurrent.ExecutionContext

trait OneTimeCheckoutTestService {
  def getTests(): List[OneTimeCheckoutTest]
}

/** A service for polling DynamoDB for one-time checkout tests config
  */
class OneTimeCheckoutTestServiceImpl(stage: Stage)(implicit ec: ExecutionContext, system: ActorSystem)
    extends ChannelTestService[OneTimeCheckoutTest](
      stage,
      ChannelTestConfig(
        channelName = "OneTimeCheckout",
        testTypeName = "one-time checkout test",
        errorMetric = getOneTimeCheckoutTestsError,
      ),
    )
    with OneTimeCheckoutTestService {
  override protected def postProcess(tests: List[OneTimeCheckoutTest]): List[OneTimeCheckoutTest] =
    tests.sortBy(_.priority)
}
