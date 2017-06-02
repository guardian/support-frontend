package lib.stepfunctions

import java.util.UUID

import scala.concurrent.Future
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.gu.support.workers.model.state.{CreatePaymentMethodState, StepFunctionUserState}
import config.Stage
import MonthlyContributionsClient._
import com.gu.support.workers.model.{Contribution, PayPalPaymentFields, StripePaymentFields, User}
import io.circe.generic.semiauto.deriveDecoder
import io.circe.Decoder
import codecs.CirceDecoders._
import com.typesafe.scalalogging.LazyLogging

object CreateMonthlyContributorRequest {
  implicit val decoder: Decoder[CreateMonthlyContributorRequest] = deriveDecoder
}
case class CreateMonthlyContributorRequest(
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
)

object MonthlyContributionsClient {
  sealed trait MonthlyContributionError
  case object StateMachineFailure extends MonthlyContributionError
}

class MonthlyContributionsClient(stage: Stage)(implicit system: ActorSystem) extends LazyLogging {
  private implicit val ec = system.dispatcher
  private val underlying = Client("MonthlyContributions", stage.toString)

  def createContributor(request: CreateMonthlyContributorRequest, requestId: UUID): EitherT[Future, MonthlyContributionError, Unit] = {
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = request.user,
      contribution = request.contribution,
      paymentFields = request.paymentFields
    )
    underlying.triggerExecution(createPaymentMethodState).bimap(
      { error =>
        logger.error(s"[$requestId] Failed to create monthly subscription - $error")
        StateMachineFailure: MonthlyContributionError
      },
      { success =>
        logger.error(s"[$requestId] Creating monthly subscription ($success)")
        ()
      }
    )
  }
}
