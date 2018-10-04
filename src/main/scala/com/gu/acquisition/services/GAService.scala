package com.gu.acquisition.services

import java.util.UUID

import com.gu.acquisition.model._
import com.gu.acquisition.services.AnalyticsService.RequestData
import com.typesafe.scalalogging.LazyLogging
import okhttp3._
import ophan.thrift.event.{AbTestInfo, Acquisition, Product}

private[services] class GAService(implicit client: OkHttpClient)
  extends AnalyticsService with LazyLogging {

  private val gaPropertyId: String = "UA-51507017-5"
  private val endpoint: HttpUrl = HttpUrl.parse("https://www.google-analytics.com")

  private[services] def buildBody(submission: AcquisitionSubmission) = {
    RequestBody.create(null, buildPayload(submission))
  }

  private[services] def buildPayload(submission: AcquisitionSubmission, transactionId: Option[String] = None): String = {
    import submission._
    val tid = transactionId.getOrElse(UUID.randomUUID().toString)
    val goExp = buildOptimizeTestsPayload(acquisition.abTests)

    // clientId cannot be empty or the call will fail
    val clientId = if (gaData.clientId != "") gaData.clientId else transactionId
    val productName = getProductName(submission.acquisition)
    val conversionCategory = getConversionCategory(submission.acquisition)
    val body = Map(
      "v" -> "1", //Version
      "cid" -> clientId,
      "tid" -> gaPropertyId,
      "dh" -> gaData.hostname,
      "uip" -> gaData.clientIpAddress.getOrElse(""), // IP Override
      "ua" -> gaData.clientUserAgent.getOrElse(""), // User Agent Override

      // Custom Dimensions
      "cd12" -> acquisition.campaignCode.map(_.mkString(",")), // Campaign code
      "cd16" -> buildABTestPayload(acquisition.abTests), //'Experience' custom dimension
      "cd17" -> acquisition.paymentProvider.getOrElse(""), // Payment method

      // Google Optimize Experiment Id
      "xid" -> goExp.map(_._1).getOrElse(""),
      "xvar" -> goExp.map(_._2).getOrElse(""),

      // The GA conversion event
      "t" -> "event",
      "ec" -> conversionCategory.name, //Event Category
      "ea" -> productName, //Event Action
      "el" -> acquisition.paymentFrequency.name, //Event Label
      "ev" -> acquisition.amount.toInt.toString, //Event Value is an Integer

      // Enhanced Ecommerce tracking https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#enhancedecom
      "ti" -> tid,
      "tcc" -> acquisition.promoCode.getOrElse(""), // Transaction coupon.
      "pa" -> "purchase", //This is a purchase
      "pr1nm" -> productName, // Product Name
      "pr1ca" -> conversionCategory.description, // Product category
      "pr1pr" -> acquisition.amount.toString, // Product Price
      "pr1qt" -> "1", // Product Quantity
      "pr1cc" -> acquisition.promoCode.getOrElse(""), // Product coupon code.
      "cu" -> acquisition.currency.toString // Currency
    )

    body
      .filter { case (key, value) => value != "" }
      .map { case (key, value) => s"$key=$value" }
      .mkString("&")
  }

  private[services] def getProductName(acquisition: Acquisition) =
    acquisition.printOptions.map(_.product.name).getOrElse(acquisition.product.name)

  private[services] def getConversionCategory(acquisition: Acquisition) =
    acquisition.printOptions.map(p => ConversionCategory.PrintConversion)
      .getOrElse(getDigitalConversionCategory(acquisition))

  private[services] def getDigitalConversionCategory(acquisition: Acquisition) =
    acquisition.product match {
      case _: Product.RecurringContribution.type |
           _: Product.Contribution.type => ConversionCategory.ContributionConversion
      case _ => ConversionCategory.DigitalConversion
    }

  private[services] def buildOptimizeTestsPayload(maybeTests: Option[AbTestInfo]) = {
    val optimizePrefix = "optimize$$"
    maybeTests.map {
      abTests =>
        abTests.tests
          .filter(test => test._1.startsWith(optimizePrefix))
          .map(test => test._1.replace(optimizePrefix, "") -> test._2)
          .toMap
    }.map(tests => (tests.keys.mkString(","), tests.values.mkString(",")))

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
      .addHeader("User-Agent", submission.gaData.clientUserAgent.getOrElse(""))
      .post(buildBody(submission))
      .build()

    RequestData(request, submission)
  }
}
