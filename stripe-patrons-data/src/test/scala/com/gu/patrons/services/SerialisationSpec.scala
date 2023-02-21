package com.gu.patrons.services

import com.gu.patrons.lambdas.{PatronCancelledEvent, PatronSignUpEvent}
import com.gu.patrons.model.{ExpandedStripeCustomer, StripeSubscription}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SerialisationSpec extends AnyFlatSpec with Matchers with LazyLogging {

  "StripeSubscription" should "deserialise successfully" in {
    decode[StripeSubscription[ExpandedStripeCustomer]](Fixtures.subscriptionJson) match {
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

  "PatronSignUpEvent" should "deserialise successfully" in {
    decode[PatronSignUpEvent](Fixtures.patronSignUpEventJson) match {
      case Left(err) =>
        fail(err.getMessage)
      case Right(event) =>
        logger.info(event.data.`object`.id)
        event.data.`object`.id should be("sub_1MX3LyJETvkRwpwqyBQPVmqs")
    }
  }
}
