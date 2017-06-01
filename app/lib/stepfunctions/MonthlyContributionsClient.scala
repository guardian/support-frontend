package lib.stepfunctions

import scala.concurrent.Future
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.gu.support.workers.model.state.CreatePaymentMethodState
import config.Stage
import MonthlyContributionsClient._
import io.circe.generic.auto._

object MonthlyContributionsClient {
  sealed trait MonthlyContributionError
  case object StateMachineFailure extends MonthlyContributionError

  type CreateMonthlyContributorRequest = CreatePaymentMethodState
}

class MonthlyContributionsClient(stage: Stage)(implicit system: ActorSystem) {
  private implicit val ec = system.dispatcher
  private val underlying = Client("MonthlyContributions", stage.toString)

  def createContributor(request: CreateMonthlyContributorRequest): EitherT[Future, MonthlyContributionError, Unit] =
    underlying.triggerExecution(request).bimap(
      { _ => StateMachineFailure: MonthlyContributionError },
      { _ => () }
    )
}
