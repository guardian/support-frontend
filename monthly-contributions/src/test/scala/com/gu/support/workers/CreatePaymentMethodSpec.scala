package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.lambdas.CreatePaymentMethod
import com.gu.support.workers.model.{PayPalPaymentFields, PaymentMethod, StripePaymentFields, User}
import com.typesafe.scalalogging.LazyLogging
import io.circe.DecodingFailure
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}



class CreatePaymentMethodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  import com.gu.support.workers.Conversions._
  import io.circe.generic.auto._

  "CreatePaymentMethod lambda" should "accept and return valid json" in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()

    val inEither : Either[StripePaymentFields, PayPalPaymentFields] = Right(PayPalPaymentFields("test_baid"))

    createPaymentMethod.handleRequest(inEither.asInputStream(), outStream, mock[Context])

    val p = outStream.toClass[PaymentMethod]()
    logger.info(s"Output: $p")
  }

  it should "fail when passed invalid json" in {
    a [DecodingFailure] should be thrownBy {
      val createPaymentMethod = new CreatePaymentMethod()

      val outStream = new ByteArrayOutputStream()

      val inStream = "Test user".asInputStream()

      createPaymentMethod.handleRequest(inStream, outStream, mock[Context])

      val p = outStream.toClass[PaymentMethod]()
      logger.info(s"Output: $p")
    }
  }
}
