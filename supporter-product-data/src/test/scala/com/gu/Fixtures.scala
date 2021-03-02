package com.gu

import scala.io.Source

//noinspection SourceNotClosed
object Fixtures {
  def loadQueryResults: String = Source.fromURL(getClass.getResource("/query-results.csv")).mkString
}
