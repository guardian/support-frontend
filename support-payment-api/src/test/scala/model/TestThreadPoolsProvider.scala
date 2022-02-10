package model

import scala.concurrent.ExecutionContext

// Mixin to have access to test versions of all thread pools used by the app.
trait TestThreadPoolsProvider extends AppThreadPoolsProvider {

  // Instead of using the application config to create the underlying execution contexts for each thread pool,
  // just use the global execution context for each one.
  private val testThreadPool: ExecutionContext = scala.concurrent.ExecutionContext.global

  override val threadPools: AppThreadPools =
    AppThreadPools(
      DefaultThreadPool(testThreadPool),
      StripeThreadPool(testThreadPool),
      PaypalThreadPool(testThreadPool),
      GoCardlessThreadPool(testThreadPool),
      SQSThreadPool(testThreadPool),
    )
}
