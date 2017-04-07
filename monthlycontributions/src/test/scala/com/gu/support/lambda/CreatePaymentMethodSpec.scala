package com.gu.support.lambda

import java.io.{ByteArrayInputStream, ByteArrayOutputStream}

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.lambda.model.DummyInput
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.mock.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}


class CreatePaymentMethodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  import io.circe.Encoder
  import io.circe.generic.auto._
  import io.circe.syntax._

  "CreatePaymentMethod lambda" should "accept and return valid json" in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod.handleRequest(asInputStream(DummyInput("test_status")), outStream, mock[Context])

    logger.info(s"Output: ${outStream.toString}")
  }

  def asInputStream[T](input: T)(implicit encoder: Encoder[T]) = {
    val convertStream = new ByteArrayOutputStream()
    convertStream.write(input.asJson.noSpaces.getBytes("UTF-8"))
    new ByteArrayInputStream(convertStream.toByteArray)
  }

}
