package com.gu.support.catalog

import com.gu.support.config.Stages.PROD
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.FlatSpec

class CatalogServiceTest extends FlatSpec with LazyLogging {

  "CatalogService" should "fetch the catalog from S3" in {
    val catalog = CatalogService(PROD).getCatalog
    catalog.foreach(i => logger.info(s"$i"))
  }
}
