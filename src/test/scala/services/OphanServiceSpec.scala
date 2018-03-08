package services

import cats.data.EitherT
import cats.data.Validated.Invalid
import cats.implicits._
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.services.DefaultOphanService
import conf.OphanConfig
import model.{DefaultThreadPool, InitializationError}
import model.acquisition.PaypalAcquisition
import org.mockito.Mockito._
import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.mockito.MockitoSugar

import scala.concurrent.{ExecutionContext, Future}

class OphanServiceSpec extends FlatSpec with Matchers with MockitoSugar with ScalaFutures {

  behavior of "Ophan Service"

  trait OphanServiceTestFixture {
    implicit val executionContextTest = DefaultThreadPool(ExecutionContext.global)
    val defaultOphanService = mock[DefaultOphanService]
    val ophanService = new OphanService(defaultOphanService)
  }

  it should "return an error if the config is invalid" in new OphanServiceTestFixture {
    val result = OphanService.fromOphanConfig(OphanConfig(null))
    result shouldBe(Invalid(InitializationError("unable to instanciate OphanService for config: " +
      "OphanConfig(null). Error trace: null")))
  }

  it should "return an error while submitting acquisition if the client throws an exception" in new OphanServiceTestFixture {
    val paypalAcquisition = mock[PaypalAcquisition]
    val paymentServiceResponseError: EitherT[Future, OphanServiceError, AcquisitionSubmission] =
      EitherT.left(Future.successful(OphanServiceError.BuildError("Error response")))
    when(defaultOphanService.submit(paypalAcquisition)).thenReturn(paymentServiceResponseError)
    whenReady(ophanService.submitAcquisition(paypalAcquisition).value){ result =>
      result.isLeft shouldBe(true)
    }
  }

  it should "submit a valid paypal acquisition" in new OphanServiceTestFixture {
    val paypalAcquisition = mock[PaypalAcquisition]
    val acquisitionSubmission = mock[AcquisitionSubmission]
    val paymentServiceResponse: EitherT[Future, OphanServiceError, AcquisitionSubmission] =
      EitherT.right(Future.successful(acquisitionSubmission))
    when(defaultOphanService.submit(paypalAcquisition)).thenReturn(paymentServiceResponse)
    whenReady(ophanService.submitAcquisition(paypalAcquisition).value){ result =>
      result.isRight shouldBe(true)
    }
  }
}
