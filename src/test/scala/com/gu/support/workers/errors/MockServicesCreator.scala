package com.gu.support.workers.errors

import com.gu.services.{ServiceProvider, Services}
import org.mockito.Matchers.any
import org.mockito.Mockito.when
import org.scalatest.mockito.MockitoSugar._

trait MockServicesCreator {
  def mockServices[T](serviceCall: Services => T, service: T): ServiceProvider = {
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    when(serviceCall(services)).thenReturn(service)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }
}
