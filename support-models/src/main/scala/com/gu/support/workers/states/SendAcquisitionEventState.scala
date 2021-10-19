package com.gu.support.workers.states

import com.gu.support.acquisitions.AcquisitionData

import java.util.UUID
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.{User, _}

case class SendAcquisitionEventState(
  requestId: UUID,
  sendThankYouEmailState: SendThankYouEmailState,
  analyticsInfo: AnalyticsInfo,
  csrUsername: Option[String],
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState {
  override def user: User = sendThankYouEmailState.user
}

object SendAcquisitionEventState {
  implicit val codec: Codec[SendAcquisitionEventState] = deriveCodec[SendAcquisitionEventState]
}
