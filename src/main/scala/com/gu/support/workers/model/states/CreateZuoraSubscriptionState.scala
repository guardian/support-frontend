package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model._

case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  acquisitionData: Option[AcquisitionData],
  scopeToken: Option[String]
) extends StepFunctionUserState {

  def accessScope: AccessScope = AccessScope.fromRaw(scopeToken)

}
