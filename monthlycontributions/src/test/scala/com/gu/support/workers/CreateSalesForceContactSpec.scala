package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.lambdas.CreateSalesForceContact
import com.gu.support.workers.model.{PaymentMethod, SalesForceContact}
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.mock.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}



class CreateSalesForceContactSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  import com.gu.support.workers.Conversions._
  import io.circe.generic.auto._

  "CreateSalesForceContact lambda" should "accept and return valid json" in {
    val createContact = new CreateSalesForceContact()

    val outStream = new ByteArrayOutputStream()

    val inStream = PaymentMethod("Credit card").asInputStream()

    createContact.handleRequest(inStream, outStream, mock[Context])

    val p = outStream.toClass[SalesForceContact]()

    logger.info(s"Output: $p")
  }
}