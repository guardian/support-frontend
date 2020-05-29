package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.redemption.Redemption.{CodeStatus, RedemptionCode}

import scala.concurrent.{ExecutionContext, Future}

object Redemption {

  case class RedemptionCode(value: String) extends AnyVal

  object CodeStatus {
    val name = "available"
    def decoded(available: Boolean): CodeStatus = if (available) CodeIsAvailable else CodeIsUsed

    case object CodeIsAvailable extends CodeStatus(true)
    case object CodeIsUsed extends CodeStatus(false)

  }
  sealed abstract class CodeStatus(val encoded: Boolean)

}

object markCodeRedeemed extends WithLogging {

  def apply(code: RedemptionCode, codeStatus: CodeStatus)(dynamoUpdate: DynamoUpdate)(implicit e: ExecutionContext): Future[Unit] =
    dynamoUpdate.update(code.value, CodeStatus.name, codeStatus.encoded).withLoggingAsync(s"marked redemption status of $code to $codeStatus")

}

object RedemptionTableAsync {
  val primaryKey = "redemptionCode"
  def forEnv(env: TouchPointEnvironment)(implicit e: ExecutionContext): DynamoTableAsync =
    DynamoTableAsync(s"redemption-codes-${env.envValue}-PROD", primaryKey)
}


