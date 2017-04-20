package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.lambdas.CreatePaymentMethod
import com.gu.support.workers.model.{PaymentMethod, User}
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.mock.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}



class CreatePaymentMethodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  import com.gu.support.workers.Conversions._
  import io.circe.generic.auto._

  "CreatePaymentMethod lambda" should "accept and return valid json" in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()

    val inStream = User("123", "Test user").asInputStream()

    createPaymentMethod.handleRequest(inStream, outStream, mock[Context])

    val p = outStream.toClass[PaymentMethod]()
    logger.info(s"Output: $p")
  }
}
