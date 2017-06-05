package com.gu.support.workers.model.state

import java.util.UUID

import com.gu.support.workers.model.{Contribution, PaymentMethod, SalesforceContactRecord, User}

case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord
) extends StepFunctionUserState
