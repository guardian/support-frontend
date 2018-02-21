package model

import akka.actor.ActorSystem
import cats.data.Validated
import play.api.BuiltInComponents

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

// Mixin to BuiltInComponents when injecting app dependencies at compile time.
// Ensures that the default thread pool is actually using Play's default thread pool.
trait DefaultThreadPoolProvider { self: BuiltInComponents =>
  // This needs to be a lazy val to avoid a null pointer exception.
  implicit lazy val defaultThreadPool: DefaultThreadPool = DefaultThreadPool(executionContext)
}

// Provides a standardised way of creating App thread pools.
// All app thread pools should be created using the load() method of instances of this trait.
sealed trait CustomThreadPoolLoader[A <: AppThreadPool] {

  def apply(ec: ExecutionContext): A

  def threadPoolId: String

  // For this method to return a valid result, the configuration for the thread pool
  // should be specified at the path: thread-pools.<threadPoolId> in application.conf
  def load()(implicit system: ActorSystem, ct: ClassTag[A]): InitializationResult[A] =
    Validated.catchNonFatal(system.dispatchers.lookup(s"thread-pools.$threadPoolId"))
      .bimap(
        err =>
          InitializationError(
            s"unable to load thread pool of type ${classTag[A].runtimeClass} with id: $threadPoolId",
            err
          ),
        this.apply,
      )
}

// Should be used as the execution context for all requests made to Stripe.
case class StripeThreadPool private (underlying: ExecutionContext) extends AppThreadPool

object StripeThreadPool extends CustomThreadPoolLoader[StripeThreadPool] {
  override val threadPoolId: String = "stripe"
}

// Should be used as the execution context for database IO.
case class JdbcThreadPool private (underlying: ExecutionContext) extends AppThreadPool

object JdbcThreadPool extends CustomThreadPoolLoader[JdbcThreadPool] {
  override val threadPoolId: String = "jdbc"
}