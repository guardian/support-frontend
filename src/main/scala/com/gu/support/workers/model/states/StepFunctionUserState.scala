package com.gu.support.workers.model.states

import com.gu.support.workers.model.User

trait StepFunctionUserState {
  def user: User
}