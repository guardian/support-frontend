package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.typesafe.scalalogging.LazyLogging
import org.mockito.Mockito.when
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{Assertion, FlatSpec, Matchers}

abstract class LambdaSpec extends FlatSpec with Matchers with MockitoSugar with MockContext with LazyLogging {
  def assertUnit(output: ByteArrayOutputStream): Assertion =
    Encoding.in[Unit](output.toInputStream()).isSuccess should be(true)
}
trait MockContext extends MockitoSugar {
  val context = mock[Context]
  when(context.getRemainingTimeInMillis).thenReturn(60000)
}
