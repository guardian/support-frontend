package com.gu.support.catalog

import scala.io.Source

object Fixtures {
  def loadCatalog: String = Source.fromURL(getClass.getResource("/catalog-prod.json")).mkString
  def loadMinCatalog: String = Source.fromURL(getClass.getResource("/catalogMin.json")).mkString
  def loadHomeDeliveryCatalog: String = Source.fromURL(getClass.getResource("/catalogHomeDelivery.json")).mkString
  def loadBadCatalog: String = Source.fromURL(getClass.getResource("/catalog-bad.json")).mkString
}
