package backend

import cats.data.EitherT
import cats.kernel.Semigroup
import com.gu.acquisition.model.errors.OphanServiceError
import model.DefaultThreadPool
import services.{DatabaseService, IdentityClient}
import model.paypal.{PaypalApiError => PaypalAPIError}
import cats.implicits._
import model.stripe.{StripeChargeError => StripeError}

import scala.concurrent.Future

sealed abstract class BackendError extends Exception {
  override def getMessage: String = this match {
    case BackendError.Database(err) => err.getMessage
    case BackendError.IdentityServiceError(err) => err.getMessage
    case BackendError.Ophan(err) => err.getMessage
    case BackendError.StripeChargeError(err) => err.getMessage
    case BackendError.PaypalApiError(err) => err.message
    case BackendError.MultipleErrors(errors) => errors.map(_.getMessage).mkString(" & ")
  }
}

object BackendError {
  final case class Database(error: DatabaseService.Error) extends BackendError
  final case class IdentityServiceError(error: IdentityClient.Error) extends BackendError
  final case class Ophan(error: OphanServiceError) extends BackendError
  final case class PaypalApiError(error: PaypalAPIError) extends BackendError
  final case class StripeChargeError(error: StripeError) extends BackendError
  final case class MultipleErrors(errors: List[BackendError]) extends BackendError

  implicit val backendSemiGroup: Semigroup[BackendError] =
  Semigroup.instance((x,y) => MultipleErrors(List(x,y)))

  def combineResults(
      result1: EitherT[Future, BackendError, Unit],
      result2:  EitherT[Future, BackendError, Unit])(implicit pool: DefaultThreadPool):  EitherT[Future, BackendError, Unit] = {
    EitherT(for {
      r1 <- result1.toValidated
      r2 <- result2.toValidated
    } yield {
      r1.combine(r2).toEither
    })
  }

  def fromIdentityError(err: IdentityClient.Error): BackendError = IdentityServiceError(err)
  def fromDatabaseError(err: DatabaseService.Error): BackendError = Database(err)
  def fromOphanError(err: OphanServiceError): BackendError = Ophan(err)
  def fromPaypalAPIError(err: PaypalAPIError): BackendError = PaypalApiError(err)
  def fromStripeChargeError(err: StripeError): BackendError = StripeChargeError(err)

}
