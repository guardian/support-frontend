package com.gu.support.redemption

import com.gu.support.redemption.DynamoUpdate.DynamoFieldUpdate
import com.gu.support.redemptions.RedemptionCode

import scala.concurrent.{ExecutionContext, Future}

object SetCodeStatus {

  def withDynamoLookup(dynamoLookup: DynamoUpdate): SetCodeStatus = new SetCodeStatus(dynamoLookup)

}

class SetCodeStatus(dynamoUpdate: DynamoUpdate) extends WithLogging {

  def apply(code: RedemptionCode, codeStatus: RedemptionTable.AvailableField)(implicit e: ExecutionContext): Future[Unit] =
    dynamoUpdate.update(code.value, DynamoFieldUpdate(RedemptionTable.AvailableField.name, codeStatus.encoded))
      .withLoggingAsync(s"marked redemption status of $code to $codeStatus")

}
