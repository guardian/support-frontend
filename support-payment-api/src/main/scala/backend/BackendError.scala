package backend

import cats.data.EitherT
import cats.kernel.Semigroup
import model.DefaultThreadPool
import services.{ContributionsStoreService, EmailService, IdentityClient}
import model.paypal.{PaypalApiError => PaypalAPIError}
import cats.implicits._
import model.amazonpay.{AmazonPayApiError => AmazonPayError}
import model.stripe.{StripeApiError => StripeError}

import scala.concurrent.Future

sealed abstract class BackendError extends Exception {
  override def getMessage: String = this match {
    case BackendError.IdentityIdMissingError(err) => err
    case BackendError.Database(err) => err.getMessage
    case BackendError.IdentityServiceError(err) => err.getMessage
    case BackendError.BigQueryError(err) => err
    case BackendError.AcquisitionsStreamError(err) => err
    case BackendError.GoogleAnalyticsError(err) => err
    case BackendError.StripeApiError(err) => err.getMessage
    case BackendError.PaypalApiError(err) => err.message
    case BackendError.AmazonPayApiError(err) => err.message
    case BackendError.Email(err) => err.getMessage
    case BackendError.TrackingError(err) => err.getMessage
    case BackendError.MultipleErrors(errors) => errors.map(_.getMessage).mkString(" & ")
  }
}

object BackendError {
  final case class IdentityIdMissingError(error: String) extends BackendError
  final case class BigQueryError(error: String) extends BackendError
  final case class AcquisitionsStreamError(error: String) extends BackendError
  final case class GoogleAnalyticsError(error: String) extends BackendError
  final case class Database(error: ContributionsStoreService.Error) extends BackendError
  final case class SupporterProductDataError(error: String) extends BackendError
  final case class IdentityServiceError(error: IdentityClient.ContextualError) extends BackendError
  final case class PaypalApiError(error: PaypalAPIError) extends BackendError
  final case class StripeApiError(error: StripeError) extends BackendError
  final case class AmazonPayApiError(err: AmazonPayError) extends BackendError
  final case class Email(error: EmailService.Error) extends BackendError
  final case class TrackingError(err: Throwable) extends BackendError
  final case class MultipleErrors(errors: List[BackendError]) extends BackendError

  implicit val backendSemiGroup: Semigroup[BackendError] =
    Semigroup.instance((x, y) => MultipleErrors(List(x, y)))

  def combineResults(
      result1: EitherT[Future, BackendError, Unit],
      result2: EitherT[Future, BackendError, Unit],
      result3: EitherT[Future, BackendError, Unit],
  )(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Unit] = {
    EitherT(for {
      r1 <- result1.toValidated
      r2 <- result2.toValidated
      r3 <- result3.toValidated
    } yield {
      r1.combine(r2).combine(r3).toEither
    })
  }

  def identityIdMissingError(err: String): BackendError = IdentityIdMissingError(err)
  def fromIdentityError(err: IdentityClient.ContextualError): BackendError = IdentityServiceError(err)
  def fromDatabaseError(err: ContributionsStoreService.Error): BackendError = Database(err)
  def fromPaypalAPIError(err: PaypalAPIError): BackendError = PaypalApiError(err)
  def fromStripeApiError(err: StripeError): BackendError = StripeApiError(err)
  def fromEmailError(err: EmailService.Error): BackendError = Email(err)
}
