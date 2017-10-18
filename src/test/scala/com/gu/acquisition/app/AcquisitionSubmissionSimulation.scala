package com.gu.acquisition.app

import com.gu.acquisition.model.{AcquisitionSubmission, OphanIds}
import com.gu.acquisition.services.DefaultOphanService
import com.typesafe.scalalogging.StrictLogging
import okhttp3.{HttpUrl, OkHttpClient}
import ophan.thrift.event.{Acquisition, PaymentFrequency, PaymentProvider}

import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration._

trait MockDataGenerator {

  def generateSubmission: AcquisitionSubmission
}

object BasicMockDataGenerator extends MockDataGenerator {

  override def generateSubmission: AcquisitionSubmission =
    AcquisitionSubmission(
      OphanIds(Some("pageviewId"), Some("visitId"), Some("browserId")),
      Acquisition(
        product = ophan.thrift.event.Product.Contribution,
        paymentFrequency = PaymentFrequency.OneOff,
        currency = "GBP",
        amount = 20d,
        amountInGBP = None,
        paymentProvider = Some(PaymentProvider.Stripe),
        campaignCode = None,
        abTests = None,
        countryCode = Some("US"),
        referrerPageViewId = None,
        referrerUrl = None,
        componentId = None,
        componentTypeV2 = None,
        source = None
      )
    )
}

class AcquisitionSubmissionSimulator(service: DefaultOphanService, generator: MockDataGenerator)(
  implicit ec: ExecutionContext) extends StrictLogging {

  import cats.instances.future._

  def submit(): Future[Unit] = {
    logger.info("submitting acquisition event to Ophan")
    service.submit(generator.generateSubmission)
      .fold(
        err => logger.error(s"failed to send acquisition to Ophan", err),
        _ => logger.info("successfully submitted acquisition to Ophan")
      )
  }
}

object AcquisitionSubmissionSimulator {

  def apply(endpoint: HttpUrl, generator: MockDataGenerator)(
    implicit ec: ExecutionContext, client: OkHttpClient
  ): AcquisitionSubmissionSimulator = {
    val service = new DefaultOphanService(endpoint)
    new AcquisitionSubmissionSimulator(service, generator)
  }
}

object Main extends App {

  import scala.concurrent.ExecutionContext.Implicits.global
  implicit val client = new OkHttpClient()

  val endpoint = HttpUrl.parse(args.headOption.getOrElse("http://localhost:9000"))
  val simulator = AcquisitionSubmissionSimulator(endpoint, BasicMockDataGenerator)

  Await.ready(simulator.submit(), 10.seconds)
}
