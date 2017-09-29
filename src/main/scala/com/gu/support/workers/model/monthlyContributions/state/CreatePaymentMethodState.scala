package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields, User}
import ophan.thrift.event.AbTest

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields],
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: Set[AbTest]
) extends StepFunctionUserState