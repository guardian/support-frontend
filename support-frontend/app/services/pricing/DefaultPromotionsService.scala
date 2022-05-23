package services.pricing

import com.amazonaws.services.s3.AmazonS3URI
import com.gu.aws.AwsS3Client
import com.gu.support.config.{Stage, TouchPointEnvironments}
import io.circe._
import io.circe.parser._
import io.circe.generic.auto._
import akka.actor.ActorSystem
import com.gu.support.catalog.{GuardianWeekly, Product}
import com.typesafe.scalalogging.LazyLogging
import services.pricing.DefaultPromotionsService.DefaultPromotions

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.ExecutionContext
import scala.concurrent.duration.DurationInt
import scala.util.Try

trait DefaultPromotionsService {
  def getPromos(product: Product): List[String]
}

object DefaultPromotionsService {
  case class DefaultPromotions(guardianWeekly: List[String])

  implicit val decoder = Decoder[DefaultPromotions]
}

class DefaultPromotionsServiceS3(
    client: AwsS3Client,
    stage: Stage,
    system: ActorSystem,
)(implicit ec: ExecutionContext)
    extends DefaultPromotionsService
    with LazyLogging {

  private val s3Uri = {
    val env = TouchPointEnvironments.fromStage(stage)
    new AmazonS3URI(s"s3://gu-promotions-tool-private/${env.envValue}/defaultPromos.json")
  }
  private val defaultPromos = new AtomicReference[DefaultPromotions](
    DefaultPromotions(guardianWeekly = Nil),
  )

  private def fetch(): Try[DefaultPromotions] =
    for {
      raw <- client.fetchAsString(s3Uri)
      defaultPromos <- decode[DefaultPromotions](raw).toTry
    } yield defaultPromos

  private def update(): Try[Unit] = fetch().map(newPromos => defaultPromos.set(newPromos))

  private def startPollingS3(): Unit =
    system.scheduler.scheduleWithFixedDelay(0.minutes, 1.minute) { () =>
      update()
        .fold(
          err => logger.error(s"Error fetching default promos from S3: ${err.getMessage}", err),
          _ => (),
        )
    }

  def getPromos(product: Product): List[String] =
    product match {
      case GuardianWeekly => defaultPromos.get().guardianWeekly
      case _ => Nil
    }

  startPollingS3()
}
