package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.threadpools.CustomPool.executionContext

import scala.concurrent.Future

class UpdateSupporterProductData(serviceProvider: ServiceProvider)
  extends SubsetServicesHandler[SendAcquisitionEventState, Unit, SendThankYouEmailState](
  serviceProvider,
  _.sendThankYouEmailState
) {

  def this() = this(ServiceProvider)

  override protected def subsetHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    Future.successful(HandlerResult((), requestInfo))
  }
}
