package services

import com.gu.support.redemption.corporate.DynamoTableAsync

import scala.concurrent.ExecutionContext

object PropensityTable {
  val primaryKey = "bwid"

  object ProductField {
    val name = "product"
  }

  def async()(implicit e: ExecutionContext): DynamoTableAsync =
    DynamoTableAsync(s"hack-jun2022-propensity-products", primaryKey)

}
