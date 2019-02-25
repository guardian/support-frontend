package com.gu.support.catalog

import scala.io.Source

object Fixtures {
  def loadCatalog = Source.fromURL(getClass.getResource("/catalog-prod.json")).mkString
  def loadMinCatalog = Source.fromURL(getClass.getResource("/catalog-min.json")).mkString
}
