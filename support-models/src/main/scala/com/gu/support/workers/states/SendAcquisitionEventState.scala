package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{User, _}
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import org.joda.time.LocalDate

trait SendAcquisitionEventState extends StepFunctionUserState {
  def requestId: UUID
  def sendThankYouEmailProductState: SendThankYouEmailProductSpecificState
  def acquisitionData: Option[AcquisitionData]
  def analyticsInfo: AnalyticsInfo
}

case class SendAcquisitionEventStateImpl(
  requestId: UUID,
  user: User,
  sendThankYouEmailProductState: SendThankYouEmailProductSpecificState,
  analyticsInfo: AnalyticsInfo,
  acquisitionData: Option[AcquisitionData]
) extends SendAcquisitionEventState

object SendAcquisitionEventState {
  implicit val decoder: Decoder[SendAcquisitionEventState] = deriveDecoder[SendAcquisitionEventStateImpl].map(identity)
}
