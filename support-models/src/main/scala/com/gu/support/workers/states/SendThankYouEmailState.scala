package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  subscriptionNumber: String,
  paymentSchedule: PaymentSchedule,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendThankYouEmailState {
  implicit val codec: Codec[SendThankYouEmailState] = deriveCodec
}

