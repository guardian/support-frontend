package services

import com.gu.aws.AwsCloudWatchMetricPut.{MetricRequest, client => cloudwatchClient}
import com.gu.aws.{AwsCloudWatchMetricPut, ProfileName}
import com.gu.support.config.{Stage, Stages}
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import org.apache.pekko.actor.ActorSystem
import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider,
}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, ComparisonOperator, Condition, QueryRequest}

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters.{IterableHasAsScala, MapHasAsJava}
import scala.jdk.FutureConverters._
import scala.util.control.NonFatal

case class ChannelTestConfig(
    channelName: String,
    testTypeName: String,
    errorMetric: Stage => MetricRequest,
)

/** Abstract base class for services that poll DynamoDB for channel test configurations.
  *
  * @tparam T
  *   The test model type (must have a Circe Decoder)
  */
abstract class ChannelTestService[T: Decoder](
    stage: Stage,
    config: ChannelTestConfig,
)(implicit ec: ExecutionContext, system: ActorSystem)
    extends StrictLogging {

  private val cachedTests = new AtomicReference[List[T]](Nil)

  private val credentialsProvider = AwsCredentialsProviderChain.builder
    .credentialsProviders(
      ProfileCredentialsProvider.builder.profileName(ProfileName).build,
      InstanceProfileCredentialsProvider.builder
        .asyncCredentialUpdateEnabled(false)
        .build,
      EnvironmentVariableCredentialsProvider.create(),
    )
    .build

  private val dynamoClient = DynamoDbAsyncClient.builder
    .region(Region.EU_WEST_1)
    .credentialsProvider(credentialsProvider)
    .build

  private val tableName = stage match {
    case Stages.PROD => "support-admin-console-channel-tests-PROD"
    case Stages.DEV => "support-admin-console-channel-tests-DEV"
    case _ => "support-admin-console-channel-tests-CODE"
  }

  /** Override to apply post-processing to decoded tests (e.g., filtering, sorting)
    */
  protected def postProcess(tests: List[T]): List[T] = tests

  private def fetchTests(): Future[List[T]] = {
    val condition = Condition
      .builder()
      .comparisonOperator(ComparisonOperator.EQ)
      .attributeValueList(
        AttributeValue.builder().s(config.channelName).build(),
      )
      .build()

    val query = QueryRequest
      .builder()
      .tableName(tableName)
      .keyConditions(Map("channel" -> condition).asJava)
      .build()

    dynamoClient
      .query(query)
      .asScala
      .map { result =>
        val items = result.items().asScala.toList
        val decodedTests = items
          .map { record =>
            DynamoJsonConverter.mapToJson(record).as[T]
          }
          .map {
            case err @ Left(msg) =>
              AwsCloudWatchMetricPut(cloudwatchClient)(
                config.errorMetric(stage),
              )
              logger.error(
                s"Could not decode ${config.testTypeName} config: $msg",
              )
              err
            case ok @ Right(_) => ok
          }
          .collect { case Right(test) => test }

        postProcess(decodedTests)
      }
  }

  // Start polling DynamoDB
  system.scheduler.scheduleAtFixedRate(0.minute, 1.minute)(() => {
    fetchTests()
      .map { tests =>
        cachedTests.set(tests)
      }
      .recover { case NonFatal(error) =>
        AwsCloudWatchMetricPut(cloudwatchClient)(config.errorMetric(stage))
        logger.error(
          s"Error fetching ${config.testTypeName} from DynamoDB: ${error.getMessage}",
        )
        Nil
      }
  })

  def getTests(): List[T] = cachedTests.get()
}
