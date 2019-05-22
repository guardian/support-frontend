package com.gu.support.catalog

import scala.io.Source

object Fixtures {
  def loadCatalog: String = Source.fromURL(getClass.getResource("/catalog.json")).mkString
  def loadMinCatalog: String = Source.fromURL(getClass.getResource("/catalogMin.json")).mkString
  def loadHomeDeliveryCatalog: String = Source.fromURL(getClass.getResource("/catalogHomeDelivery.json")).mkString
}
