package com.gu.support.workers

import com.amazonaws.services.lambda.runtime.Context
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers
import org.mockito.MockitoSugar

abstract class LambdaSpec extends AnyFlatSpec with Matchers with MockContext

abstract class AsyncLambdaSpec extends AsyncFlatSpec with Matchers

trait MockContext extends MockitoSugar {
  val context: Context = mock[Context]
  when(context.getRemainingTimeInMillis).thenReturn(60000)
}
