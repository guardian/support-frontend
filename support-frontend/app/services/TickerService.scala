package services

import com.gu.aws.{AwsCloudWatchMetricPut, AwsS3Client}
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.getTickerDataError
import com.gu.aws.AwsS3Client.S3Location
import com.gu.support.config.Stages.CODE
import com.gu.support.config.{Stage, Stages}
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser.decode
import org.apache.pekko.actor.ActorSystem

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration.DurationInt
import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success, Try}

/** A service for polling the ticker data in S3. This data is passed through to the client in the window.guardian object
  * for use when displaying a campaign ticker component. Each ticker campaign (global, US, AU) is stored as a separate
  * file in the contributions-ticker bucket.
  */

case class TickerData(
    total: Double,
    goal: Double,
)
object TickerData {
  implicit val decoder = deriveDecoder[TickerData]
  implicit val encoder = deriveEncoder[TickerData]
}
case class Tickers(
    global: TickerData,
    US: TickerData,
    AU: TickerData,
)
object Tickers {
  implicit val decoder = deriveDecoder[Tickers]
  implicit val encoder = deriveEncoder[Tickers]
}

class TickerService(
    stage: Stage,
    client: AwsS3Client,
)(implicit val ec: ExecutionContext, system: ActorSystem)
    extends StrictLogging {
  private val tickerCache = new AtomicReference[Option[Tickers]](None)

  private val awsStage = stage match {
    case Stages.DEV => CODE
    case _ => stage
  }
  private def buildS3Uri(name: String) =
    S3Location("contributions-ticker", s"$awsStage/$name.json")

  private def fetch(name: String): Try[TickerData] =
    for {
      raw <- client.fetchAsString(buildS3Uri(name))
      defaultPromos <- decode[TickerData](raw).toTry
    } yield defaultPromos

  private def fetchTickers(): Try[Tickers] =
    for {
      global <- fetch("global")
      us <- fetch("US")
      au <- fetch("AU")
    } yield Tickers(global = global, US = us, AU = au)

  private def update(): Try[Unit] = fetchTickers().map(tickers => tickerCache.set(Some(tickers)))

  private def startPollingS3(): Unit =
    system.scheduler.scheduleWithFixedDelay(0.minutes, 1.minutes) { () =>
      update() match {
        case Failure(err) =>
          AwsCloudWatchMetricPut(cloudwatchClient)(getTickerDataError(stage))
          logger.error(s"Error fetching ticker data from S3: ${err.getMessage}", err)
        case Success(_) => ()
      }
    }

  def getTickers(): Option[Tickers] = tickerCache.get()

  startPollingS3()
}
