package com.gu.support.workers.states

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.{User, _}

case class SendAcquisitionEventState(
  sendThankYouEmailState: SendThankYouEmailState,
  analyticsInfo: AnalyticsInfo,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState {
  override def user: User = sendThankYouEmailState.user
}

object SendAcquisitionEventState {
  implicit val codec: Codec[SendAcquisitionEventState] = deriveCodec[SendAcquisitionEventState]
}
