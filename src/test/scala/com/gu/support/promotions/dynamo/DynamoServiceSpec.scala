package com.gu.support.promotions.dynamo

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.promotions.{DynamoPromotionCollection, Tracking}
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class DynamoServiceSpec extends FlatSpec with Matchers with LazyLogging{

  "DynamoService" should "work" in {
    val items = new DynamoPromotionCollection(ConfigFactory.load(), TouchPointEnvironments.SANDBOX).all().toList

    items.filter(_.promotionType == Tracking).foreach(p => logger.info(s"${p.promotionType}"))
    val landingPages = items.filter(_.expires.isDefined)
    landingPages.nonEmpty should be (true)
  }
}
