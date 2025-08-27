package services

import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import admin.settings.LandingPageTest
import com.gu.aws.AwsCloudWatchMetricSetup.getLandingPageTestsError
import com.gu.aws.{AwsCloudWatchMetricPut, ProfileName}
import com.gu.support.config.{Stage, Stages}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Json, JsonObject}
import org.apache.pekko.actor.ActorSystem
import services.LandingPageTestService.parseLandingPageTest
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
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters.{IterableHasAsScala, MapHasAsJava, MapHasAsScala}
import scala.jdk.FutureConverters._
import scala.util.control.NonFatal
import scala.concurrent.duration._

trait LandingPageTestService {
  def getTests(): List[LandingPageTest]
}

object LandingPageTestService {
  // Converts Dynamodb Attributes to Circe Json
  private def dynamoToJson(attribute: AttributeValue): Json = {
    if (attribute.hasM()) {
      // Map
      dynamoMapToJson(attribute.m())
    } else if (attribute.hasL()) {
      // List
      Json.fromValues(attribute.l().asScala.map(dynamoToJson))
    } else if (attribute.hasSs()) {
      // Set of strings
      Json.fromValues(attribute.ss().asScala.map(Json.fromString))
    } else if (attribute.s() != null) {
      // String
      Json.fromString(attribute.s())
    } else if (attribute.n() != null) {
      // Number
      Json.fromDouble(attribute.n().toDouble).getOrElse(Json.Null)
    } else if (attribute.bool() != null) {
      // Bool
      Json.fromBoolean(attribute.bool())
    } else {
      Json.Null
    }
  }

  private def dynamoMapToJson(item: java.util.Map[String, AttributeValue]): Json = {
    val jsonMap: Map[String, Json] = item.asScala.view
      .mapValues(dynamoToJson)
      .toMap

    Json.fromJsonObject(JsonObject.fromMap(jsonMap))
  }

  def parseLandingPageTest(record: java.util.Map[String, AttributeValue]): Either[io.circe.Error, LandingPageTest] =
    dynamoMapToJson(record).as[LandingPageTest]
}

/** A service for polling DynamoDb for landing page tests config
  */
class LandingPageTestServiceImpl(stage: Stage)(implicit val ec: ExecutionContext, system: ActorSystem)
    extends LandingPageTestService
    with StrictLogging {
  private val cachedTests = new AtomicReference[List[LandingPageTest]](Nil)

  private val credentialsProvider = AwsCredentialsProviderChain.builder
    .credentialsProviders(
      ProfileCredentialsProvider.builder.profileName(ProfileName).build,
      InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
      EnvironmentVariableCredentialsProvider.create(),
    )
    .build

  private val dynamoClient = DynamoDbAsyncClient.builder
    .region(Region.EU_WEST_1)
    .credentialsProvider(credentialsProvider)
    .build

  private val tableName = stage match {
    case Stages.PROD => s"support-admin-console-channel-tests-PROD"
    case _ => s"support-admin-console-channel-tests-CODE"
  }

  private def fetchLandingPageTests(): Future[List[LandingPageTest]] = {
    val condition = Condition
      .builder()
      .comparisonOperator(ComparisonOperator.EQ)
      .attributeValueList(AttributeValue.builder().s("SupportLandingPage").build())
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
        items
          .map(parseLandingPageTest)
          .map({
            case err @ Left(msg) =>
              AwsCloudWatchMetricPut(cloudwatchClient)(getLandingPageTestsError(stage))
              logger.error(s"Could not decode landing page test config: $msg")
              err
            case ok @ Right(_) => ok
          })
          .collect({ case Right(test) => test }) // filter out any invalid tests
          .sortBy(test => test.priority)
      }
  }

  // Start polling DynamoDb
  system.scheduler.scheduleAtFixedRate(0.minute, 1.minute)(() => {
    fetchLandingPageTests()
      .map { tests =>
        cachedTests.set(tests)
      }
      .recover { case NonFatal(error) =>
        AwsCloudWatchMetricPut(cloudwatchClient)(getLandingPageTestsError(stage))
        logger.error(s"Error fetching epic tests from dynamodb: ${error.getMessage}")
        Nil
      }
  })

  def getTests(): List[LandingPageTest] = cachedTests.get()
}
