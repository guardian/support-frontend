package com.gu.support.workers

import com.amazonaws.services.lambda.runtime.Context
import com.typesafe.scalalogging.LazyLogging
import org.mockito.Mockito.when
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

abstract class LambdaSpec extends FlatSpec with Matchers with MockitoSugar with MockContext with LazyLogging

trait MockContext extends MockitoSugar {
  val context = mock[Context]
  when(context.getRemainingTimeInMillis).thenReturn(60000)
}
