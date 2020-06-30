package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironment

import scala.concurrent.ExecutionContext

object RedemptionTable {
  val primaryKey = "redemptionCode"

  object AvailableField {
    val name = "available"
    def decoded(available: Boolean): AvailableField = if (available) CodeIsAvailable else CodeIsUsed

    case object CodeIsAvailable extends AvailableField(true)
    case object CodeIsUsed extends AvailableField(false)

  }
  sealed abstract class AvailableField(val encoded: Boolean)

  object CorporateIdField {
    val name = "corporateId"
  }

  def forEnvAsync(env: TouchPointEnvironment)(implicit e: ExecutionContext): DynamoTableAsync =
    DynamoTableAsync(s"redemption-codes-${env.envValue}", primaryKey)

}


