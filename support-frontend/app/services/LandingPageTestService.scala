package services

import admin.settings.LandingPageTest
import com.gu.aws.ProfileName
import com.gu.support.config.Stage
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Json, JsonObject}
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

import scala.jdk.CollectionConverters.{IterableHasAsScala, MapHasAsJava, MapHasAsScala}
import scala.jdk.FutureConverters._
import scala.util.control.NonFatal

object LandingPageTestService {
  // Converts Dynamodb Attributes to Circe Json
  def dynamoToJson(attribute: AttributeValue): Json = {
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

  def dynamoMapToJson(item: java.util.Map[String, AttributeValue]): Json = {
    val jsonMap: Map[String, Json] = item.asScala.view
      .mapValues(dynamoToJson)
      .toMap

    Json.fromJsonObject(JsonObject.fromMap(jsonMap))
  }

  def parseLandingPageTest(record: java.util.Map[String, AttributeValue]): Either[io.circe.Error, LandingPageTest] =
    dynamoMapToJson(record).as[LandingPageTest]
}

class LandingPageTestService(stage: Stage) extends StrictLogging {
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

  private val tableName = s"support-admin-console-channel-tests-$stage"

  def fetchLandingPageTests(): List[LandingPageTest] = {
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
              logger.error(s"Could not decode landing page config: $msg")
              err
            case ok @ Right(_) => ok
          })
          .collect({ case Right(test) => test })
          .sortBy(epicTest => epicTest.priority)
      }
      .recover { case NonFatal(error) =>
        logger.error(s"Error fetching epic tests from dynamodb: ${error.getMessage}")
        putAppleNewsMetric("EpicTestsError")
        Nil
      }
    Nil
  }

}
