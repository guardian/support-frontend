package monitoring

import com.gu.monitoring.SafeLogging
import org.apache.pekko.actor.ActorSystem
import services.stepfunctions.SupportWorkersClient

import scala.concurrent.duration._
import scala.util.{Failure, Success}

class StateMachineMonitor(client: SupportWorkersClient, actorSystem: ActorSystem) extends SafeLogging {

  val cloudwatchMetricsPattern = "regular-contributions-state-machine-unavailable"

  def start(): Unit = {
    implicit val ec = actorSystem.dispatcher
    actorSystem.scheduler.schedule(5.seconds, 60.seconds) {
      client.healthy().onComplete {
        case Success(true) => logger.debug("Regular contributions state machine is healthy")
        case Success(false) =>
          logger.error(scrub"Regular contributions state machine is not available [$cloudwatchMetricsPattern]")
        case Failure(exception) =>
          logger.error(
            scrub"Exception while fetching regular contributions state machine status [$cloudwatchMetricsPattern]",
            exception,
          )
      }
    }
  }
}
