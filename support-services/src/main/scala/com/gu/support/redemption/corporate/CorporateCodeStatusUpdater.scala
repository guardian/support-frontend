package com.gu.support.redemption.corporate

import com.gu.support.redemption.corporate.DynamoUpdate.DynamoFieldUpdate
import com.gu.support.redemptions.RedemptionCode

import scala.concurrent.{ExecutionContext, Future}

object CorporateCodeStatusUpdater {

  def withDynamoUpdate(dynamoUpdate: DynamoUpdate): CorporateCodeStatusUpdater = new CorporateCodeStatusUpdater(
    dynamoUpdate,
  )

}

class CorporateCodeStatusUpdater(dynamoUpdate: DynamoUpdate) extends WithLogging {

  def setStatus(code: RedemptionCode, codeStatus: RedemptionTable.AvailableField)(implicit
      e: ExecutionContext,
  ): Future[Unit] =
    dynamoUpdate
      .update(code.value, DynamoFieldUpdate(RedemptionTable.AvailableField.name, codeStatus.encoded))
      .withLoggingAsync(s"marked redemption status of $code to $codeStatus")

}
