package com.gu.acquisition.services

import java.util.UUID

import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.services.AnalyticsService.RequestData
import okhttp3._
import ophan.thrift.event.AbTestInfo

private[services] class GAService(gaPropertyId: String)(implicit client: OkHttpClient)
  extends AnalyticsService {

  private val endpoint: HttpUrl = HttpUrl.parse("https://www.google-analytics.com")

  private[services] def buildBody(submission: AcquisitionSubmission) = {
    RequestBody.create(null, buildPayload(submission))
  }

  private[services] def buildPayload(submission: AcquisitionSubmission): String = {
    val transactionId = UUID.randomUUID().toString
    val body = Map(
      "v" -> "1", //Version
      "tid" -> gaPropertyId,
      "dh" -> submission.gaData.hostname.getOrElse(""),
      "uip" -> submission.gaData.clientIp.getOrElse(""), // IP Override
      "ua" -> submission.gaData.clientUserAgent.getOrElse(""), // User Agent Override
      "uid" -> submission.ophanIds.browserId.getOrElse(""), // TODO: Or visitId? Does this work here? https://support.google.com/analytics/answer/3123662

      // Custom Dimensions
      "cd16" -> buildABTestPayload(submission.acquisition.abTests),

      // The GA conversion event
      "t" -> "event",
      "ec" -> "AcquisitionConversion", //Event Category
      "ea" -> submission.acquisition.product.name, //Event Action
      "el" -> submission.acquisition.paymentFrequency.name, //Event Label
      "ev" -> submission.acquisition.amount.toInt.toString, //Event Value is an Integer

      // Enhanced Ecommerce tracking https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#enhancedecom
      "ti" -> transactionId,
      "tcc" -> submission.acquisition.promoCode.getOrElse(""), // Transaction coupon.
      "pa" -> "purchase", //This is a purchase
      "pr1nm" -> submission.acquisition.product.name, // Product Name
      "pr1pr" -> submission.acquisition.amount.toString, // Product Price
      "pr1qt" -> "1", // Product Quantity
      "cu" -> submission.acquisition.currency.toString // Currency

      // &ta=Google%20Store%20-%20Online       // Affiliation.
      // &tt=2.85                              // Tax.
      // &ts=5.34                              // Shipping.
    )


    body
      .filter { case (key, value) => value != "" }
      .map { case (key, value) => s"$key=$value" }
      .mkString("&")
    //Link to a hit in hitbuilder https://ga-dev-tools.appspot.com/hit-builder/?v=1&t=event&tid=UA-51507017-5&cid=555&dh=support.code.dev-theguardian.com&ec=AcquisitionConversion&ea=RecurringContribution&ti=T12345&tr=5&pa=purchase&pr1nm=RecurringContribution&el=monthly&ev=5&cu=AUD
  }

  private[services] def buildABTestPayload(maybeTests: Option[AbTestInfo]) =
    maybeTests.map {
      abTests =>
        abTests.tests
          .map(test => s"${test._1}=${test._2}")
          .mkString(",")
    }.getOrElse("")


  override def buildRequest(submission: AcquisitionSubmission): RequestData = {

    val url = endpoint.newBuilder()
      .addPathSegment("collect")
      .build()

    val request = new Request.Builder()
      .url(url)
      .addHeader("User-Agent", "") //TODO: If we can get this then GA can work out a whole load of stuff
      .post(buildBody(submission))
      .build()

    RequestData(request, submission)
  }
}
