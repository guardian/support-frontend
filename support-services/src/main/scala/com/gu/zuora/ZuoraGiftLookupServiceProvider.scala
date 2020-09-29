package com.gu.zuora

import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.config.{ZuoraConfig, ZuoraConfigProvider}
import com.gu.support.touchpoint.TouchpointServiceProvider

import scala.concurrent.ExecutionContext
import scala.concurrent.duration.DurationInt

class ZuoraGiftLookupServiceProvider(configProvider: ZuoraConfigProvider)(implicit ec: ExecutionContext)
  extends TouchpointServiceProvider[ZuoraGiftLookupService, ZuoraConfig](configProvider){

  override protected def createService(config: ZuoraConfig) = new ZuoraGiftService(config, configurableFutureRunner(60.seconds))
}
