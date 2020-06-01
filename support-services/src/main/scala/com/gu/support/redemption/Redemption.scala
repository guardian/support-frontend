package com.gu.support.redemption

import scala.concurrent.{ExecutionContext, Future}

case class RedemptionCode(value: String) extends AnyVal

object markCodeRedeemed extends WithLogging {

  def apply(code: RedemptionCode, codeStatus: RedemptionTable.AvailableField)(dynamoUpdate: DynamoUpdate)(implicit e: ExecutionContext): Future[Unit] =
    dynamoUpdate.update(code.value, RedemptionTable.AvailableField.name, codeStatus.encoded)
      .withLoggingAsync(s"marked redemption status of $code to $codeStatus")

}
