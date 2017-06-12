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
import com.gu.i18n.Country

object CreateMonthlyContributorRequest {
  implicit val decoder: Decoder[CreateMonthlyContributorRequest] = deriveDecoder
}
case class CreateMonthlyContributorRequest(
  firstName: String,
  lastName: String,
  country: Country,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
)

object MonthlyContributionsClient {
  sealed trait MonthlyContributionError
  case object StateMachineFailure extends MonthlyContributionError
}

class MonthlyContributionsClient(stage: Stage)(implicit system: ActorSystem) {
  private implicit val ec = system.dispatcher
  private val underlying = Client("MonthlyContributions", stage.toString)

  def createContributor(request: CreateMonthlyContributorRequest, user: User, requestId: UUID): EitherT[Future, MonthlyContributionError, Unit] = {
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      contribution = request.contribution,
      paymentFields = request.paymentFields
    )
    underlying.triggerExecution(createPaymentMethodState).bimap(
      { _ => StateMachineFailure: MonthlyContributionError }, { _ => () }
    )
  }
}
