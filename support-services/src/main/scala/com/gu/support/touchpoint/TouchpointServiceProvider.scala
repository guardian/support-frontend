package com.gu.support.touchpoint

import com.gu.support.config.TouchpointConfigProvider

trait TouchpointService

abstract class TouchpointServiceProvider[T <: TouchpointService, C](configProvider: TouchpointConfigProvider[C]) {
  private lazy val defaultService: T = createService(configProvider.get())
  private lazy val uatService: T = createService(configProvider.get(isTestUser = true))

  def forUser(isTestUser: Boolean): T = if (isTestUser) uatService else defaultService

  protected def createService(config: C): T
}
