package com.gu.support.workers

import com.amazonaws.services.lambda.runtime.Context
import org.mockito.Mockito.when
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{AsyncFlatSpec, FlatSpec, Matchers}

abstract class LambdaSpec extends FlatSpec with Matchers with MockContext

abstract class AsyncLambdaSpec extends AsyncFlatSpec with Matchers {
  implicit override def executionContext = scala.concurrent.ExecutionContext.Implicits.global
}

trait MockContext extends MockitoSugar {
  val context = mock[Context]
  when(context.getRemainingTimeInMillis).thenReturn(60000)
}
