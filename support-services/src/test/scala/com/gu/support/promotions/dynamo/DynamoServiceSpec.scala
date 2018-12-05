package com.gu.support.promotions.dynamo

import com.gu.support.config.{PromotionsConfigProvider, Stages}
import com.gu.support.promotions.DynamoPromotionCollection
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class DynamoServiceSpec extends FlatSpec with Matchers with LazyLogging {

  "DynamoService" should "work" ignore {
    val config = new PromotionsConfigProvider(ConfigFactory.load(), Stages.PROD).get()
    val items = new DynamoPromotionCollection(config.tables).all.toList
    val discounts = items.filter(_.discount.isDefined)
    logger.info(s"There are ${discounts.length} discounts")
    discounts.filter(_.discount.get.durationMonths.isEmpty).foreach(p => logger.info(s"${p}"))
    val landingPages = items.filter(_.expires.isDefined)
    landingPages.nonEmpty should be(true)
  }
}
