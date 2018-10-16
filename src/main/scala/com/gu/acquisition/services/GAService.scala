package com.gu.acquisition.services

import java.util.UUID

import com.gu.acquisition.model._
import com.gu.acquisition.services.AnalyticsService.RequestData
import com.typesafe.scalalogging.LazyLogging
import okhttp3._
import ophan.thrift.event.{AbTestInfo, Acquisition, Product}
import GAService.clientIdPattern
import cats.data.EitherT
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.model.errors.AnalyticsServiceError.BuildError

import scala.util.matching.Regex

private[services] object GAService {
  val clientIdPattern: Regex = raw"GA\d\.\d\.(\d+)\..*".r
}

private[services] class GAService(implicit client: OkHttpClient)
  extends AnalyticsService with LazyLogging {

  private val gaPropertyId: String = "UA-51507017-5"
  private val endpoint: HttpUrl = HttpUrl.parse("https://www.google-analytics.com")

  private[services] def buildBody(submission: AcquisitionSubmission): Either[BuildError, RequestBody] = {
    buildPayload(submission).map{
      payload =>
        logger.info(s"GA Payload: $payload")
        RequestBody.create(null, payload)
    }
  }

  private[services] def buildPayload(submission: AcquisitionSubmission, transactionId: Option[String] = None): Either[BuildError, String] = {
    import submission._
    val tid = transactionId.getOrElse(UUID.randomUUID().toString)
    val goExp = buildOptimizeTestsPayload(acquisition.abTests)

    // clientId cannot be empty or the call will fail
    sanitiseClientId(gaData.clientId).map {
      clientId =>
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
          "cd12" -> acquisition.campaignCode.map(_.mkString(",")).getOrElse(""), // Campaign code
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
  }

  private[services] def sanitiseClientId(maybeId: String): Either[BuildError, String] = {
    maybeId match {
      case clientIdPattern(id) => Right(id) // If we have a full _ga cookie string extract the client id
      case "" => Left(BuildError("Client ID cannot be an empty string.\n" +
        "To link server side with client side events you need to pass a valid clientId from the `_ga` cookie.\n" +
        "Otherwise you can pass any non-empty string eg. `UUID.randomUUID().toString`\n" +
        "More info here: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid"))
      case _ => Right(maybeId) // Otherwise assume that the caller has passed in the client id correctly
    }
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


  override def buildRequest(submission: AcquisitionSubmission): Either[BuildError, RequestData] = {

    val url = endpoint.newBuilder()
      .addPathSegment("collect")
      .build()

    buildBody(submission).map {
      requestBody =>
        val request = new Request.Builder()
          .url(url)
          .addHeader("User-Agent", submission.gaData.clientUserAgent.getOrElse(""))
          .post(requestBody)
          .build()

        RequestData(request, submission)
    }
  }
}
