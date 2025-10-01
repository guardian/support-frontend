package services.stepfunctions

import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.states.CheckoutFailureState
import com.gu.support.workers.{CheckoutFailureReasons, Status, User}
import org.mockito.Mockito._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar
import services.stepfunctions.StepFunctionExecutionStatus._
import software.amazon.awssdk.awscore.exception.AwsServiceException
import software.amazon.awssdk.services.sfn.model.StateExitedEventDetails

import scala.util.{Failure, Success}

object StatusResults {
  val success = StatusResponse(Status.Success, "tracking123", None)
  def failure(reason: CheckoutFailureReason): StatusResponse =
    StatusResponse(Status.Failure, "tracking123", Some(reason))
  val pending = StatusResponse(Status.Pending, "tracking123", None)
}

class SupportWorkersClientTest extends AnyFlatSpec with Matchers with MockitoSugar {

  val mockStateWrapper: StateWrapper = mock[StateWrapper]

  val fillerState = StateExitedEventDetails
    .builder()
    .name("CreatePaymentMethodLambda")
    .build()
  val failure = Failure(new Exception("test"))

  "checkoutStatus" should "detect a successful execution correctly" in {
    val checkoutSuccessState = StateExitedEventDetails
      .builder()
      .name("CheckoutSuccess")
      .build()
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
    val failedCheckoutState = StateExitedEventDetails
      .builder()
      .name("SucceedOrFailChoice")
      .output("test")
      .build()
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

  "generateExecutionName" should "generate a valid name" in {
    def doTest(len: Int, value: Long, truncated: Boolean) = {
      import Client.generateExecutionName
      val actual = generateExecutionName(("123456789-" * 10).take(len), value)
      withClue(s"string: <$actual>") {
        actual.length should be(80)
        actual should fullyMatch regex ("[0-9a-zA-Z_-]+")
        if (truncated)
          actual.takeRight(2) should be("--")
        else
          actual.last should not be (('-'))
      }
    }
    doTest(68, Long.MinValue, truncated = false)
    doTest(69, Long.MinValue, truncated = true)
    doTest(68, Long.MaxValue, truncated = false)
    doTest(69, Long.MaxValue, truncated = true)
    doTest(68, 0L, truncated = false)
    doTest(69, 0L, truncated = true)
    doTest(68, System.nanoTime(), truncated = false)
    doTest(69, System.nanoTime(), truncated = true)
  }

}
