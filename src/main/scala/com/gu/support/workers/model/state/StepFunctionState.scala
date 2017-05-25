package com.gu.support.workers.model.state

import com.gu.support.workers.model.User

trait StepFunctionState

trait StepFunctionUserState extends StepFunctionState {
  def user: User
}