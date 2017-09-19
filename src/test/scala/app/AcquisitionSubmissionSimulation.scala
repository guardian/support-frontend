package app

import akka.actor.ActorSystem
import akka.http.scaladsl.model.Uri
import akka.stream.{ActorMaterializer, Materializer}
import com.gu.acquisition.services.OphanService
import com.typesafe.scalalogging.StrictLogging
import ophan.thrift.event.{Acquisition, PaymentFrequency, PaymentProvider}

import scala.concurrent.{ExecutionContext, Future}

trait MockDataGenerator {

  def generateAcquisition: Acquisition

  def generateBrowserId: String

  def generateViewId: String

  def generateVisitId: Option[String]
}

object BasicMockDataGenerator extends MockDataGenerator {

  override def generateAcquisition = Acquisition(
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

  override def generateBrowserId: String = "browserId"

  override def generateViewId: String = "viewId"

  override def generateVisitId: Option[String] = Some("visitId")
}

class AcquisitionSubmissionSimulator(service: OphanService, generator: MockDataGenerator)(implicit ec: ExecutionContext)
  extends StrictLogging {

  import cats.instances.future._
  import generator._

  def submit(): Future[Unit] = {
    logger.info("submitting acquisition event to Ophan")
    service.submit(generateAcquisition, generateBrowserId, generateViewId, generateVisitId)
      .fold(
        err => logger.error(s"failed to send acquisition to Ophan", err),
        _ => logger.info("successfully submitted acquisition to Ophan")
      )
  }
}

object AcquisitionSubmissionSimulator {

  def apply(endpoint: Uri, generator: MockDataGenerator)(
    implicit ec: ExecutionContext,
    system: ActorSystem,
    materializer: Materializer
  ): AcquisitionSubmissionSimulator = {

    val service = new OphanService(endpoint)
    new AcquisitionSubmissionSimulator(service, generator)
  }
}

object Main extends App {

  implicit val system = ActorSystem()
  implicit val ec = system.dispatcher
  implicit val materializer = ActorMaterializer()

  val endpoint = args.headOption.getOrElse("http://localhost:9000")
  val simulator = AcquisitionSubmissionSimulator(endpoint, BasicMockDataGenerator)

  simulator.submit().onComplete { _ =>
    materializer.shutdown()
    system.terminate()
  }
}
