package com.gu.services

import com.gu.config.Configuration._
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.paypal.{PayPalConfig, PayPalService}
import com.gu.salesforce.{SalesforceConfig, SalesforceService}
import com.gu.stripe.{StripeConfig, StripeService}
import com.gu.zuora.{ZuoraConfig, ZuoraService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

object Services extends Services

class Services {
  lazy val stripeService = new ServiceProvider[StripeService, StripeConfig](
    new StripeService(_, configurableFutureRunner(10.seconds)), stripeConfigProvider
  )
  lazy val payPalService = new ServiceProvider[PayPalService, PayPalConfig](
    new PayPalService(_), payPalConfigProvider
  )
  lazy val salesforceService = new ServiceProvider[SalesforceService, SalesforceConfig](
    new SalesforceService(_, configurableFutureRunner(30.seconds)), salesforceConfigProvider
  )
  lazy val zuoraService = new ServiceProvider[ZuoraService, ZuoraConfig](
    new ZuoraService(_, configurableFutureRunner(30.seconds)), zuoraConfigProvider
  )
}
