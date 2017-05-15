package com.gu.services

import com.gu.config.{TouchpointConfig, TouchpointConfigProvider}

trait Service

class ServiceProvider[A <: Service, B <: TouchpointConfig](constructor: B => A, configProvider: TouchpointConfigProvider[B]) {
  private lazy val defaultService: A = constructor(configProvider.get())
  private lazy val uatService: A = constructor(configProvider.get(true))

  def get(isTestUser: Boolean = false): A = if (isTestUser) uatService else defaultService
}
