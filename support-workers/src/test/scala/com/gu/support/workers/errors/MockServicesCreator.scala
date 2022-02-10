package com.gu.support.workers.errors

import com.gu.services.{ServiceProvider, Services}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatestplus.mockito.MockitoSugar._

trait MockServicesCreator {
  def mockService[T](serviceCall: Services => T, service: T): ServiceProvider = {
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    when(serviceCall(services)).thenReturn(service)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

  def mockServices[T](services: (Services => T, T)*): ServiceProvider = {
    val serviceProvider = mock[ServiceProvider]
    val mockServices = mock[Services]
    services.foreach { case (serviceCall, service) =>
      when(serviceCall(mockServices)).thenReturn(service)
      when(serviceProvider.forUser(any[Boolean])).thenReturn(mockServices)
    }
    serviceProvider
  }
}
