package com.gu.patrons.services

import com.gu.patrons.lambdas.PatronCancelledEvent
import com.gu.patrons.model.StripeSubscription
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SerialisationSpec extends AnyFlatSpec with Matchers with LazyLogging {

  "StripeSubscription" should "deserialise successfully" in {
    decode[StripeSubscription](Fixtures.subscriptionJson) match {
      case Left(err) =>
        fail(err.getMessage)
      case Right(sub) =>
        logger.info(sub.created.toString)
        succeed
    }

  }

  "PatronCancelledEvent" should "deserialise successfully" in {
    decode[PatronCancelledEvent](Fixtures.patronCancelledEventJson) match {
      case Left(err) =>
        fail(err.getMessage)
      case Right(sub) =>
        logger.info(sub.data.`object`.customer)
        sub.data.`object`.customer should be("cus_Mdvgw8EXalnWPN")
    }
  }

}
