package services.stepfunctions

import com.amazonaws.AmazonServiceException
import com.amazonaws.services.stepfunctions.model.StateExitedEventDetails
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.states.CheckoutFailureState
import com.gu.support.workers.{CheckoutFailureReasons, Status, User}
import org.mockito.Mockito._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar
import services.stepfunctions.StepFunctionExecutionStatus._

import scala.util.{Failure, Success}

object StatusResults {
  val success = StatusResponse(Status.Success, "tracking123", None)
  def failure(reason: CheckoutFailureReason): StatusResponse =
    StatusResponse(Status.Failure, "tracking123", Some(reason))
  val pending = StatusResponse(Status.Pending, "tracking123", None)
}

class SupportWorkersClientTest extends AnyFlatSpec with Matchers with MockitoSugar {

  val mockStateWrapper: StateWrapper = mock[StateWrapper]

  val fillerState = new StateExitedEventDetails
  fillerState.setName("CreatePaymentMethodLambda")
  val failure = Failure(new AmazonServiceException("test"))

  "checkoutStatus" should "detect a successful execution correctly" in {
    val checkoutSuccessState = new StateExitedEventDetails
    checkoutSuccessState.setName("CheckoutSuccess")
    val actual =
      checkoutStatus(
        List(failure, Success(fillerState), Success(checkoutSuccessState), failure),
        mockStateWrapper,
        "tracking123",
      )
    actual shouldBe StatusResults.success
  }

  "checkoutStatus" should "detect a pending execution correctly" in {
    val actual = checkoutStatus(List(Success(fillerState), Success(fillerState)), mockStateWrapper, "tracking123")
    actual shouldBe StatusResults.pending
  }

  "checkoutStatus" should "detect a failed execution correctly" in {
    val failedCheckoutState = new StateExitedEventDetails
    failedCheckoutState.setName("SucceedOrFailChoice")
    failedCheckoutState.setOutput("test")
    when(mockStateWrapper.unWrap[CheckoutFailureState]("test"))
      .thenReturn(Success(CheckoutFailureState(mock[User], CheckoutFailureReasons.Unknown)))
    val actual =
      checkoutStatus(
        List(Success(fillerState), Success(fillerState), Success(failedCheckoutState)),
        mockStateWrapper,
        "tracking123",
      )
    actual shouldBe StatusResults.failure(CheckoutFailureReasons.Unknown)
  }

}
