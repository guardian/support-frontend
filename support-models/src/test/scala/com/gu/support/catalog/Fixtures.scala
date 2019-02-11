package com.gu.support.catalog

import scala.io.Source

object Fixtures {
  def loadCatalog = Source.fromURL(getClass.getResource("/catalog.json")).mkString
  def loadMinCatalog = Source.fromURL(getClass.getResource("/catalogMin.json")).mkString
  def loadHomeDeliveryCatalog = Source.fromURL(getClass.getResource("/catalogHomeDelivery.json")).mkString
}
