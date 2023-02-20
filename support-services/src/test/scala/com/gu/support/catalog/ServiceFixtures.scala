package com.gu.support.catalog

import scala.io.Source

object ServiceFixtures {
  def loadCatalog: String = Source.fromURL(getClass.getResource("/catalog-prod.json")).mkString
}
