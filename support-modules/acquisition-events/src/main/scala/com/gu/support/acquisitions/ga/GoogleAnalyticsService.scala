package com.gu.support.acquisitions.ga

import cats.data.EitherT
import com.gu.support.acquisitions.calculator.{AcquisitionModel, AnnualisedValueTwoCalculator, PrintOptionsModel}
import com.gu.support.acquisitions.AbTest
import com.gu.support.acquisitions.ga.GoogleAnalyticsService.buildBody
import com.gu.support.acquisitions.ga.models.GAError.{BuildError, NetworkFailure, ResponseUnsuccessful}
import com.gu.support.acquisitions.ga.models.{ConversionCategory, GAData, GAError}
import com.gu.support.acquisitions.models.AcquisitionProduct.{Contribution, DigitalSubscription, GuardianWeekly, Paper, RecurringContribution}
import com.gu.support.acquisitions.models.{AcquisitionDataRow, AcquisitionProduct, PrintOptions, PrintProduct}
import com.gu.support.acquisitions.utils.Retry
import com.gu.support.workers.SupporterPlus
import com.gu.support.zuora.api.ReaderType
import com.typesafe.scalalogging.LazyLogging
import okhttp3._

import java.io.IOException
import java.util.UUID
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.control.NonFatal
import scala.util.matching.Regex

trait GoogleAnalyticsService {
  def submit(acquisition: AcquisitionDataRow, gaData: GAData, maxRetries: Int)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, List[GAError], Unit]
}

object GoogleAnalyticsService extends LazyLogging {
  private val clientIdPattern: Regex = raw"GA\d\.\d\.(\d+\.\d+)".r

  // e.g. GUARDIAN_WEEKLY becomes GuardianWeekly
  private[ga] def camelCase(s: String): String = s
    .split("_")
    .map(_.toLowerCase.capitalize)
    .mkString("")

  private[ga] val gaPropertyId: String = "UA-51507017-5"

  private[ga] def buildBody(acquisition: AcquisitionDataRow, gaData: GAData)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, BuildError, RequestBody] =
    EitherT {
      getAnnualisedValue(acquisition)
        .leftMap(error => {
          logger.warn(s"Couldn't retrieve annualised value for this acquisition: $error")
          0d // We still want to record the acquisition even if we can't get the AV
        })
        .merge[Double]
        .map(av => buildPayload(acquisition, av, gaData))
        .map { maybePayload =>
          maybePayload.map { payload =>
            logger.info(s"GA payload: $payload")
            RequestBody.create(null, payload)
          }
        }
    }

  private[ga] def getAnnualisedValue(
      acquisition: AcquisitionDataRow,
  )(implicit ec: ExecutionContext): EitherT[Future, String, Double] = {
    val amount = acquisition.amount.getOrElse[BigDecimal](0.0)
    val acquisitionModel = AcquisitionModel(
      amount.toDouble,
      acquisition.product,
      acquisition.currency.iso,
      acquisition.paymentFrequency,
      acquisition.paymentProvider,
      acquisition.printOptions.map(printOptions =>
        PrintOptionsModel(printOptions.product, printOptions.deliveryCountry.alpha2),
      ),
    )
    EitherT.fromEither(AnnualisedValueTwoCalculator.getAnnualisedValue(acquisitionModel))
  }

  private[ga] def getSuccessfulSubscriptionSignUpMetric(conversionCategory: ConversionCategory) =
    conversionCategory match {
      case ConversionCategory.ContributionConversion => ""
      case _ => "1"
    }

  private[ga] def buildPayload(
      acquisition: AcquisitionDataRow,
      annualisedValue: Double,
      gaData: GAData,
      transactionId: Option[String] = None,
  ): Either[BuildError, String] = {
    val tid = transactionId.getOrElse(UUID.randomUUID().toString)
    val goExp = buildOptimizeTestsPayload(acquisition.abTests)

    // clientId cannot be empty or the call will fail
    sanitiseClientId(gaData.clientId).map { clientId =>
      val productName = getProductName(acquisition)
      val conversionCategory = getConversionCategory(acquisition)
      val productCheckout = getProductCheckout(acquisition)
      val body = Map[String, String](
        "v" -> "1", // Version
        "cid" -> clientId,
        "tid" -> gaPropertyId,
        "dh" -> gaData.hostname,
        "uip" -> gaData.clientIpAddress.getOrElse(""), // IP Override
        "ua" -> gaData.clientUserAgent.getOrElse(""), // User Agent Override

        // Custom Dimensions
        "cd12" -> acquisition.campaignCode.getOrElse(""), // Campaign code
        "cd16" -> buildABTestPayload(acquisition.abTests), // 'Experience' custom dimension
        "cd17" -> camelCase(acquisition.paymentProvider.map(_.value).getOrElse("")), // Payment method
        "cd19" -> acquisition.promoCode.getOrElse(""), // Promo code
        "cd25" -> acquisition.reusedExistingPaymentMethod.toString,
        "cd26" -> (acquisition.readerType == ReaderType.Gift).toString,
        "cd27" -> productCheckout.getOrElse(""),
        "cd30" -> (acquisition.readerType == ReaderType.Corporate).toString,

        // Custom metrics
        "cm10" -> getSuccessfulSubscriptionSignUpMetric(conversionCategory),

        // Google Optimize Experiment Id
        "xid" -> goExp.testNames,
        "xvar" -> goExp.variantNames,

        // The GA conversion event
        "t" -> "event",
        "ec" -> conversionCategory.name, // Event Category
        "ea" -> productName, // Event Action
        "el" -> camelCase(acquisition.paymentFrequency.value), // Event Label
        "ev" -> acquisition.amount.map(_.toInt).getOrElse(0).toString, // Event Value is an Integer

        // Enhanced Ecommerce tracking https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#enhancedecom
        "ti" -> tid,
        "tcc" -> acquisition.promoCode.getOrElse(""), // Transaction coupon.
        "pa" -> "purchase", // This is a purchase
        "pr1nm" -> productName, // Product Name
        "pr1ca" -> conversionCategory.description, // Product category
        "pr1pr" -> annualisedValue.toString, // Product Price - we are tracking the annualised value here as this is what goes into the revenue metric
        "pr1qt" -> "1", // Product Quantity
        "pr1cc" -> acquisition.promoCode.getOrElse(""), // Product coupon code.
        "pr1cm15" -> acquisition.amount.getOrElse("").toString, // Custom metric 15 - purchasePrice
        "cu" -> acquisition.currency.toString, // Currency
      )

      body
        .filter { case (_, value) => value != "" }
        .map { case (key, value) => s"$key=$value" }
        .mkString("&")
    }
  }

  private[ga] def sanitiseClientId(maybeId: String): Either[BuildError, String] = {
    maybeId match {
      case clientIdPattern(id) => Right(id) // If we have a full _ga cookie string extract the client id
      case "" =>
        Left(
          BuildError(
            "Client ID cannot be an empty string.\n" +
              "To link server side with client side events you need to pass a valid clientId from the `_ga` cookie.\n" +
              "Otherwise you can pass any non-empty string eg. `UUID.randomUUID().toString`\n" +
              "More info here: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid",
          ),
        )
      case _ => Right(maybeId) // Otherwise assume that the caller has passed in the client id correctly
    }
  }

  private[ga] def getProductCheckout(acquisition: AcquisitionDataRow): Option[String] =
    acquisition.product match {
      case Contribution | RecurringContribution => Some("Contribution")
      case DigitalSubscription => Some("DigitalPack")
      case Paper => getProductCheckoutForPrint(acquisition.printOptions)
      case GuardianWeekly => Some("GuardianWeekly")
    }

  private[ga] def getProductCheckoutForPrint(maybePrintOptions: Option[PrintOptions]) = {
    import com.gu.support.acquisitions.models.PrintProduct._
    maybePrintOptions.map(
      _.product match {
        case VoucherEveryday | VoucherSaturday | VoucherSunday | VoucherSixday | VoucherWeekend | HomeDeliveryEveryday |
            HomeDeliverySaturday | HomeDeliverySunday | HomeDeliverySixday | HomeDeliveryWeekend =>
          "Paper"
        case VoucherEverydayPlus | VoucherSaturdayPlus | VoucherSundayPlus | VoucherSixdayPlus | VoucherWeekendPlus |
            HomeDeliveryEverydayPlus | HomeDeliverySaturdayPlus | HomeDeliverySundayPlus | HomeDeliverySixdayPlus |
            HomeDeliveryWeekendPlus =>
          "PaperAndDigital"
        case PrintProduct.GuardianWeekly => "GuardianWeekly"
      },
    )
  }

  private[ga] def getProductName(acquisition: AcquisitionDataRow) =
    acquisition.printOptions.map(po => camelCase(po.product.value)).getOrElse(camelCase(acquisition.product.value))

  private[ga] def getConversionCategory(acquisition: AcquisitionDataRow) =
    if (acquisition.printOptions.nonEmpty) ConversionCategory.PrintConversion
    else getDigitalConversionCategory(acquisition)

  private[ga] def getDigitalConversionCategory(acquisition: AcquisitionDataRow) =
    acquisition.product match {
      case AcquisitionProduct.Contribution | AcquisitionProduct.RecurringContribution =>
        ConversionCategory.ContributionConversion
      case _ => ConversionCategory.DigitalConversion
    }

  case class OptimizeTestsPayload(testNames: String, variantNames: String)
  private[ga] def buildOptimizeTestsPayload(abTests: List[AbTest]): OptimizeTestsPayload = {
    OptimizeTestsPayload(
      abTests.map(_.name).mkString(","),
      abTests.map(_.variant).mkString(","),
    )
  }

  private[ga] def buildABTestPayload(abTests: List[AbTest]): String =
    abTests
      .map(test => s"${test.name}=${test.variant}")
      .mkString(",")
}

// For test specs, does nothing
object GoogleAnalyticsServiceMock extends GoogleAnalyticsService {
  def submit(acquisition: AcquisitionDataRow, gaData: GAData, maxRetries: Int)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, List[GAError], Unit] =
    EitherT.fromEither(Right(()))
}

// For test conversions, logs the payload but doesn't send to GA
object GoogleAnalyticsServiceTest extends GoogleAnalyticsService {
  def submit(acquisition: AcquisitionDataRow, gaData: GAData, maxRetries: Int)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, List[GAError], Unit] =
    buildBody(acquisition, gaData)
      .leftMap[List[GAError]](err => List(err))
      .map(_ => ())
}

// For live conversions
class GoogleAnalyticsServiceLive(client: OkHttpClient) extends GoogleAnalyticsService with LazyLogging {
  private[ga] val endpoint: HttpUrl = HttpUrl.parse("https://www.google-analytics.com")

  private[ga] def executeRequest(request: Request): EitherT[Future, GAError, Unit] = {
    val p = Promise[Either[GAError, Unit]]

    client
      .newCall(request)
      .enqueue(new Callback {

        override def onFailure(call: Call, e: IOException): Unit =
          p.success(Left(NetworkFailure(e)))

        private[ga] def close(response: Response): Unit =
          try {
            response.close()
          } catch {
            case NonFatal(_) =>
          }

        override def onResponse(call: Call, response: Response): Unit =
          try {
            if (response.isSuccessful) p.success(Right(()))
            else p.success(Left(ResponseUnsuccessful(request, response)))
          } finally {
            close(response)
          }
      })

    EitherT(p.future)
  }

  def submit(acquisition: AcquisitionDataRow, gaData: GAData, maxRetries: Int)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, List[GAError], Unit] =
    Retry(maxRetries) {

      val url = endpoint
        .newBuilder()
        .addPathSegment("collect")
        .build()

      def buildRequest(requestBody: RequestBody): Request =
        new Request.Builder()
          .url(url)
          .addHeader("User-Agent", gaData.clientUserAgent.getOrElse(""))
          .post(requestBody)
          .build()

      for {
        requestBody <- buildBody(acquisition, gaData)
        request = buildRequest(requestBody)
        result <- executeRequest(request)
      } yield result

    }
}
