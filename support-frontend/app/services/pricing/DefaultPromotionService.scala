package services.pricing

import com.gu.aws.{AwsCloudWatchMetricPut, AwsS3Client}
import com.gu.support.config.Stage
import io.circe._
import io.circe.parser._
import io.circe.generic.auto._
import org.apache.pekko.actor.ActorSystem
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.defaultPromotionsLoadingFailure
import com.gu.aws.AwsS3Client.S3Location
import com.gu.support.catalog.{DigitalPack, GuardianWeekly, Paper, Product, SupporterPlus}
import com.typesafe.scalalogging.LazyLogging
import services.pricing.DefaultPromotionService.DefaultPromotions

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.ExecutionContext
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success, Try}

trait DefaultPromotionService {
  def getPromoCodes(product: Product): List[String]
}

object DefaultPromotionService {
  case class DefaultPromotions(
      guardianWeekly: List[String],
      paper: List[String],
      digital: List[String],
      supporterPlus: List[String],
  )

  implicit val decoder = Decoder[DefaultPromotions]
}

class DefaultPromotionServiceS3(
    client: AwsS3Client,
    stage: Stage,
    system: ActorSystem,
)(implicit ec: ExecutionContext)
    extends DefaultPromotionService
    with LazyLogging {

  private val s3Uri =
    S3Location("support-admin-console", s"$stage/default-promos.json")

  private val defaultPromoCodes = new AtomicReference[DefaultPromotions](
    DefaultPromotions(guardianWeekly = Nil, paper = Nil, digital = Nil, supporterPlus = Nil),
  )

  private def fetch(): Try[DefaultPromotions] =
    for {
      raw <- client.fetchAsString(s3Uri)
      defaultPromos <- decode[DefaultPromotions](raw).toTry
    } yield defaultPromos

  private def update(): Try[Unit] = fetch().map(newPromos => defaultPromoCodes.set(newPromos))

  private def startPollingS3(): Unit =
    system.scheduler.scheduleWithFixedDelay(0.minutes, 10.minutes) { () =>
      update() match {
        case Failure(err) =>
          AwsCloudWatchMetricPut(cloudwatchClient)(defaultPromotionsLoadingFailure(stage))
          logger.error(s"Error fetching default promos from $s3Uri: ${err.getMessage}", err)
        case Success(_) => ()
      }
    }

  def getPromoCodes(product: Product): List[String] =
    product match {
      case GuardianWeekly => defaultPromoCodes.get().guardianWeekly
      case Paper => defaultPromoCodes.get().paper
      case DigitalPack => defaultPromoCodes.get().digital
      case SupporterPlus => defaultPromoCodes.get().supporterPlus
      case _ => Nil
    }

  startPollingS3()
}
