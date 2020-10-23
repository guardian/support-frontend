package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.{User, _}
import io.circe.Decoder

case class SendAcquisitionEventState(
  sendThankYouEmailState: SendThankYouEmailState,
  analyticsInfo: AnalyticsInfo,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState {

  override def user: User = sendThankYouEmailState.user
}

object SendAcquisitionEventState {
  def decoderToProductSpecificState: Decoder[SendThankYouEmailState] =
    implicitly[Decoder[SendThankYouEmailState]].prepare(_.downField("sendThankYouEmailState"))

  implicit val codec: Codec[SendAcquisitionEventState] = deriveCodec[SendAcquisitionEventState]
}
