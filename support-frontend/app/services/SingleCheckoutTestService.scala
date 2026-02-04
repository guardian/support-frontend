package services

import admin.settings.SingleCheckoutTest
import com.gu.aws.AwsCloudWatchMetricSetup.getSingleCheckoutTestsError
import com.gu.support.config.Stage
import org.apache.pekko.actor.ActorSystem

import scala.concurrent.ExecutionContext

trait SingleCheckoutTestService {
  def getTests(): List[SingleCheckoutTest]
}

/** A service for polling DynamoDB for single checkout tests config
  */
class SingleCheckoutTestServiceImpl(stage: Stage)(implicit ec: ExecutionContext, system: ActorSystem)
    extends ChannelTestService[SingleCheckoutTest](
      stage,
      ChannelTestConfig(
        channelName = "SingleCheckout",
        testTypeName = "single checkout test",
        errorMetric = getSingleCheckoutTestsError,
      ),
    )
    with SingleCheckoutTestService {

  override protected def postProcess(tests: List[SingleCheckoutTest]): List[SingleCheckoutTest] =
    tests.sortBy(_.priority)
}
