package model

import akka.actor.ActorSystem
import cats.data.Validated
import cats.syntax.apply._
import cats.syntax.validated._

import scala.concurrent.ExecutionContext
import scala.reflect._

// Models a thread pool used by the app.
// This allows us to specify a service is dependent on a specific thread pool,
// rather than a generic execution context which may or may not be the correct one.
sealed trait AppThreadPool extends ExecutionContext {

  // Underlying execution context. Most likely a configured Akka dispatcher.
  // Used to implement the execute() and reportFailure() methods of the ExecutionContext trait.
  def underlying: ExecutionContext

  override def execute(runnable: Runnable): Unit = underlying.execute(runnable)

  override def reportFailure(cause: Throwable): Unit = underlying.reportFailure(cause)
}

// Represents Play's default thread pool.
case class DefaultThreadPool(underlying: ExecutionContext) extends AppThreadPool

// Provides a standardised way of creating App thread pools.
// All app thread pools should be created using the load() method of instances of this trait.
sealed trait CustomThreadPoolLoader[A <: AppThreadPool] {

  def apply(ec: ExecutionContext): A

  def threadPoolId: String

  // For this method to return a valid result, the configuration for the thread pool
  // should be specified at the path: thread-pools.<threadPoolId> in application.conf
  def load()(implicit system: ActorSystem, ct: ClassTag[A]): InitializationResult[A] =
    Validated
      .catchNonFatal(system.dispatchers.lookup(s"thread-pools.$threadPoolId"))
      .bimap(
        err =>
          InitializationError(
            s"unable to load thread pool of type ${classTag[A].runtimeClass} with id: $threadPoolId",
            err,
          ),
        this.apply,
      )
}

// Should be used as the execution context for all requests made to Stripe.
case class StripeThreadPool private (underlying: ExecutionContext) extends AppThreadPool

object StripeThreadPool extends CustomThreadPoolLoader[StripeThreadPool] {
  override val threadPoolId: String = "stripe"
}

// Should be used as the execution context for all requests made to Paypal.
case class PaypalThreadPool private (underlying: ExecutionContext) extends AppThreadPool

object PaypalThreadPool extends CustomThreadPoolLoader[PaypalThreadPool] {
  override val threadPoolId: String = "paypal"
}

// Should be used as the execution context for all requests made to GoCardless.
case class GoCardlessThreadPool private (underlying: ExecutionContext) extends AppThreadPool

object GoCardlessThreadPool extends CustomThreadPoolLoader[GoCardlessThreadPool] {
  override val threadPoolId: String = "gocardless"
}

// Should be used as the execution context for database queue.
case class SQSThreadPool private (underlying: ExecutionContext) extends AppThreadPool

object SQSThreadPool extends CustomThreadPoolLoader[SQSThreadPool] {
  override val threadPoolId: String = "sqs"
}

// Models all thread pools required by the application
case class AppThreadPools private (
    default: DefaultThreadPool,
    stripe: StripeThreadPool,
    paypal: PaypalThreadPool,
    goCardless: GoCardlessThreadPool,
    sqs: SQSThreadPool,
)

object AppThreadPools {

  def load(implicit playExecutionContext: ExecutionContext, system: ActorSystem): InitializationResult[AppThreadPools] =
    (
      DefaultThreadPool(playExecutionContext).valid: InitializationResult[DefaultThreadPool],
      StripeThreadPool.load(),
      PaypalThreadPool.load(),
      GoCardlessThreadPool.load(),
      SQSThreadPool.load(),
    ).mapN(AppThreadPools.apply)
}

// Mixin to BuiltInComponents when injecting app dependencies at compile time.
// Ensures all the thread pools required by app components are in scope.
trait AppThreadPoolsProvider {

  def threadPools: AppThreadPools

  // Have to be lazy, otherwise the threadPools val would get initialised, causing a null pointer exception.
  implicit lazy val defaultThreadPool: DefaultThreadPool = threadPools.default
  implicit lazy val stripeThreadPool: StripeThreadPool = threadPools.stripe
  implicit lazy val paypalThreadPool: PaypalThreadPool = threadPools.paypal
  implicit lazy val goCardlessThreadPool: GoCardlessThreadPool = threadPools.goCardless
  implicit lazy val sqsThreadPool: SQSThreadPool = threadPools.sqs
}
