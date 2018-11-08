package services

import cats.data.EitherT
import cats.data.Validated.Invalid
import cats.implicits._
import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.services.DefaultAcquisitionService
import conf.OphanConfig
import model.{AcquisitionData, ClientBrowserInfo, DefaultThreadPool, InitializationError}
import model.acquisition.PaypalAcquisition
import com.paypal.api.payments.Payment
import ophan.thrift.event.Acquisition
import org.mockito.Mockito._
import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.mockito.MockitoSugar
import play.api.test.FakeRequest

import scala.concurrent.{ExecutionContext, Future}

class AnalyticsServiceSpec extends FlatSpec with Matchers with MockitoSugar with ScalaFutures {

  behavior of "Ophan Service"

  trait OphanServiceTestFixture {
    implicit val executionContextTest = DefaultThreadPool(ExecutionContext.global)
    val defaultOphanService = mock[DefaultAcquisitionService]
    val ophanService = new AnalyticsService(defaultOphanService)
    val paypalAcquisition = PaypalAcquisition(
      payment = mock[Payment],
      acquisitionData = AcquisitionData(
        None, None, None, None, None, None, None, None, None, None, None, None, None
      ),
      identityId = None,
      clientBrowserInfo = ClientBrowserInfo.fromRequest(FakeRequest(), None)
    )
  }

  it should "return an error if the config is invalid" in new OphanServiceTestFixture {
    val result = AnalyticsService.fromOphanConfig(OphanConfig(null))
    result shouldBe an [Invalid[InitializationError]]
  }

  it should "return an error while submitting acquisition if the client throws an exception" in new OphanServiceTestFixture {
    val error: AnalyticsServiceError = AnalyticsServiceError.BuildError("Error response")
    val paymentServiceResponseError: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
      EitherT.left(Future.successful(List(error)))
    when(defaultOphanService.submit(paypalAcquisition)).thenReturn(paymentServiceResponseError)
    whenReady(ophanService.submitAcquisition(paypalAcquisition).value){ result =>
      result.isLeft shouldBe(true)
    }
  }

  it should "submit a valid paypal acquisition" in new OphanServiceTestFixture {
    val acquisitionSubmission = AcquisitionSubmission(
      ophanIds = OphanIds(None, None, None),
      gaData = GAData("","",Some(""),Some("")),
      acquisition = Acquisition(
        product = ophan.thrift.event.Product.Contribution,
        paymentFrequency = ophan.thrift.event.PaymentFrequency.OneOff,
        currency = "GBP",
        amount = 1
      )
    )
    val paymentServiceResponse: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
      EitherT.right(Future.successful(acquisitionSubmission))
    when(defaultOphanService.submit(paypalAcquisition)).thenReturn(paymentServiceResponse)
    whenReady(ophanService.submitAcquisition(paypalAcquisition).value){ result =>
      result.isRight shouldBe(true)
    }
  }
}
