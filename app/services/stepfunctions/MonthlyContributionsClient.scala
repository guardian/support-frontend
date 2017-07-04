package services.stepfunctions

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
import com.gu.i18n.Country

object StripePaymentToken {
  implicit val decoder: Decoder[StripePaymentToken] = deriveDecoder
}
case class StripePaymentToken(stripeToken: String) {
  def stripePaymentFields(userId: String): StripePaymentFields = StripePaymentFields(
    userId = userId,
    stripeToken = stripeToken
  )
}

object CreateMonthlyContributorRequest {
  implicit val decoder: Decoder[CreateMonthlyContributorRequest] = deriveDecoder
}
case class CreateMonthlyContributorRequest(
  firstName: String,
  lastName: String,
  country: Country,
  contribution: Contribution,
  paymentFields: Either[StripePaymentToken, PayPalPaymentFields]
)

object MonthlyContributionsClient {
  sealed trait MonthlyContributionError
  case object StateMachineFailure extends MonthlyContributionError
}

class MonthlyContributionsClient(stage: Stage)(implicit system: ActorSystem) extends LazyLogging {
  private implicit val ec = system.dispatcher
  private val underlying = Client("MonthlyContributions", stage.toString)

  def createContributor(request: CreateMonthlyContributorRequest, user: User, requestId: UUID): EitherT[Future, MonthlyContributionError, Unit] = {
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      contribution = request.contribution,
      paymentFields = request.paymentFields.leftMap(_.stripePaymentFields(user.id))
    )
    underlying.triggerExecution(createPaymentMethodState).bimap(
      { error =>
        logger.error(s"[$requestId] Failed to create monthly contribution - $error")
        StateMachineFailure: MonthlyContributionError
      },
      { success =>
        logger.info(s"[$requestId] Creating monthly contribution ($success)")
        ()
      }
    )
  }
}
