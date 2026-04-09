package services

import admin.settings.Methodology
import com.gu.aws.AwsCloudWatchMetricPut.{MetricRequest, client => cloudwatchClient}
import com.gu.aws.{AwsCloudWatchMetricPut, ProfileName}
import com.gu.support.config.{Stage, Stages}
import com.typesafe.scalalogging.StrictLogging
import com.gu.aws.AwsCloudWatchMetricPut.{MetricDimensionName, MetricDimensionValue, MetricName, MetricNamespace}
import io.circe.{Decoder, HCursor}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import org.apache.pekko.actor.ActorSystem
import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider,
}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, QueryRequest, ScanRequest}

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters.{IterableHasAsScala, MapHasAsJava}
import scala.jdk.FutureConverters._
import scala.util.control.NonFatal

/** Raw variant sample from a single hourly record in DynamoDB */
case class VariantSample(
    variantName: String,
    annualisedValueInGBP: Double,
    annualisedValueInGBPPerView: Double,
    views: Int,
)

object VariantSample {
  implicit val variantSampleDecoder: Decoder[VariantSample] = deriveDecoder[VariantSample]
}

/** A single hourly test sample from DynamoDB */
case class TestSample(
    testName: String,
    variants: List[VariantSample],
    timestamp: String,
)

object TestSample {
  implicit val testSampleDecoder: Decoder[TestSample] = deriveDecoder[TestSample]
}

/** Aggregated variant performance data */
case class VariantMean(
    variantName: String,
    mean: Double,
)

/** Final aggregated bandit data for a test */
case class BanditData(
    testName: String,
    sortedVariants: List[VariantMean],
)

object BanditData {
  private val MINIMUM_SAMPLES = 6 // Minimum number of hourly samples required

  /** Calculate mean performance for a variant across multiple hourly samples */
  def calculateOverallMeanForVariant(samples: List[VariantSample]): Double = {
    val totalViews = samples.map(_.views).sum
    if (totalViews == 0) 0.0
    else {
      samples.map { sample =>
        (sample.views.toDouble / totalViews) * sample.annualisedValueInGBPPerView
      }.sum
    }
  }

  /** Build aggregated bandit data from hourly samples */
  def buildBanditDataFromSamples(
      testName: String,
      samples: List[TestSample],
      variantNames: List[String],
  ): BanditData = {
    if (samples.length < MINIMUM_SAMPLES) {
      // Not enough samples, return default weighting (all zeros)
      BanditData(
        testName = testName,
        sortedVariants = variantNames.map(name => VariantMean(name, 0.0)),
      )
    } else {
      // Aggregate all variant samples across all time periods
      val allVariantSamples = samples.flatMap(_.variants)

      // Calculate mean for each variant
      val variantMeans = variantNames.map { variantName =>
        val variantSamples = allVariantSamples.filter(_.variantName == variantName)
        val mean = calculateOverallMeanForVariant(variantSamples)
        VariantMean(variantName, mean)
      }

      // Sort by mean descending (best first)
      val sortedVariants = variantMeans.sortBy(-_.mean)

      BanditData(testName = testName, sortedVariants = sortedVariants)
    }
  }
}

/** Service for fetching bandit performance data from DynamoDB.
  *
  * Polls the support-bandit table every 5 minutes to get variant performance metrics.
  */
class BanditDataService(stage: Stage)(implicit ec: ExecutionContext, system: ActorSystem) extends StrictLogging {

  private val cachedBanditData = new AtomicReference[List[BanditData]](Nil)

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
    case Stages.PROD => "support-bandit-PROD"
    case _ => "support-bandit-CODE"
  }

  private val errorMetric: MetricRequest = MetricRequest(
    namespace = MetricNamespace("support-frontend"),
    name = MetricName("BanditDataFetchError"),
    dimensions = Map(
      MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
    ),
  )

  /** Get unique test names from the table using Scan. This is done once per refresh to discover all tests.
    */
  private def getUniqueTestNames(): Future[Set[String]] = {
    val scanRequest = ScanRequest
      .builder()
      .tableName(tableName)
      .projectionExpression("testName") // Only fetch testName to minimize data transfer
      .build()

    dynamoClient
      .scan(scanRequest)
      .asScala
      .map { result =>
        result
          .items()
          .asScala
          .flatMap(item => Option(item.get("testName")).map(_.s()))
          .toSet
      }
  }

  /** Fetch hourly samples for a specific test using Query operation. Optionally limit the number of samples returned.
    */
  private def fetchSamplesForTest(testName: String, sampleCount: Option[Int]): Future[List[TestSample]] = {
    val queryBuilder = QueryRequest
      .builder()
      .tableName(tableName)
      .keyConditionExpression("testName = :testName")
      .expressionAttributeValues(
        Map(
          ":testName" -> AttributeValue.builder().s(testName).build(),
        ).asJava,
      )
      .scanIndexForward(false) // Newest first

    val queryRequest = sampleCount match {
      case Some(limit) => queryBuilder.limit(limit).build()
      case None => queryBuilder.build()
    }

    dynamoClient
      .query(queryRequest)
      .asScala
      .map { result =>
        val items = result.items().asScala.toList
        items
          .map { record =>
            DynamoJsonConverter.mapToJson(record).as[TestSample]
          }
          .collect { case Right(sample) => sample }
      }
  }

  /** Fetch and aggregate bandit data for all tests */
  private def fetchBanditData(): Future[List[BanditData]] = {
    val fetchFuture = for {
      // Step 1: Get all unique test names
      testNames <- getUniqueTestNames()

      // Step 2: Fetch samples for each test and build bandit data
      banditDataList <- Future.traverse(testNames.toList) { testName =>
        fetchSamplesForTest(testName, sampleCount = None)
          .map { samples =>
            // Extract variant names from samples
            val variantNames = samples
              .flatMap(_.variants.map(_.variantName))
              .distinct

            // Build aggregated bandit data
            val banditData = BanditData.buildBanditDataFromSamples(testName, samples, variantNames)

            logger.debug(
              s"Built bandit data for test $testName: ${samples.length} samples, ${variantNames.length} variants",
            )

            banditData
          }
          .recover { case NonFatal(error) =>
            logger.error(s"Error fetching samples for test $testName: ${error.getMessage}")
            // Return empty bandit data for this test
            BanditData(testName, Nil)
          }
      }
    } yield {
      logger.info(s"Fetched bandit data for ${banditDataList.size} tests from DynamoDB")
      banditDataList
    }

    // Add 30 second timeout
    val timeoutFuture = org.apache.pekko.pattern.after(30.seconds, system.scheduler) {
      Future.failed(new java.util.concurrent.TimeoutException("DynamoDB fetch timed out after 30 seconds"))
    }

    Future.firstCompletedOf(Seq(fetchFuture, timeoutFuture))
  }

  // Start polling DynamoDB every 5 minutes
  system.scheduler.scheduleAtFixedRate(0.minute, 5.minutes) { () =>
    fetchBanditData()
      .map { data =>
        cachedBanditData.set(data)
      }(ec)
      .recover { case NonFatal(error) =>
        AwsCloudWatchMetricPut(cloudwatchClient)(errorMetric)
        logger.error(s"Error fetching bandit data from DynamoDB: ${error.getMessage}")
        Nil
      }(ec)
  }(ec)

  def getBanditData(): List[BanditData] = cachedBanditData.get()

  def getBanditDataForTest(testName: String): Option[BanditData] =
    getBanditData().find(_.testName == testName)
}

object BanditDataService
