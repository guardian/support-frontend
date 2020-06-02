package com.gu.support.redemption

import scala.concurrent.{ExecutionContext, Future}

object SetCodeStatus {

  def withDynamoLookup(dynamoLookup: DynamoUpdate): SetCodeStatus = new SetCodeStatus(dynamoLookup)

}

class SetCodeStatus(dynamoUpdate: DynamoUpdate) extends WithLogging {

  def apply(code: RedemptionCode, codeStatus: RedemptionTable.AvailableField)(implicit e: ExecutionContext): Future[Unit] =
    dynamoUpdate.update(code.value, RedemptionTable.AvailableField.name, codeStatus.encoded)
      .withLoggingAsync(s"marked redemption status of $code to $codeStatus")

}
