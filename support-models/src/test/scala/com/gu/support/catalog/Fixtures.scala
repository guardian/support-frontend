package com.gu.support.catalog

import scala.io.Source

object Fixtures {
  def loadCatalog: String = Source.fromURL(getClass.getResource("/catalog-prod.json")).mkString
  def loadBadCatalog: String = Source.fromURL(getClass.getResource("/catalog-bad.json")).mkString
}
