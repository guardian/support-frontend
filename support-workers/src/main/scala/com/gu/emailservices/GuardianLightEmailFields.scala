package com.gu.emailservices

import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianLightState

import scala.concurrent.{ExecutionContext, Future}

class GuardianLightEmailFields {
  def build(
      state: SendThankYouEmailGuardianLightState,
  )(implicit ec: ExecutionContext): Future[EmailFields] = {
    // TODO: populate this when we know what's needed
    val fields = List()

    Future.successful(EmailFields(fields, state.user, "guardian-light"))
  }
}
