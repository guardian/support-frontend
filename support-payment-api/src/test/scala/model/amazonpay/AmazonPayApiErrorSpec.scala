package model.amazonpay

import com.gu.support.workers.CheckoutFailureReasons.{AmazonPayFatal, AmazonPayTryAgain, AmazonPayTryAnotherCard}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class AmazonPayApiErrorSpec extends AnyWordSpec with Matchers {

  "AmazonPayApiError" when {

    "withReason" should {
      "translate amazon errors into client side errors" in {
        val errorMessage = "error message"

        val InvalidPaymentMethod = AmazonPayApiError.withReason(200, errorMessage, "InvalidPaymentMethod")
        InvalidPaymentMethod.failureReason mustBe Some(AmazonPayTryAnotherCard.asString)

        val ProcessingFailure = AmazonPayApiError.withReason(200, errorMessage, "ProcessingFailure")
        ProcessingFailure.failureReason mustBe Some(AmazonPayTryAgain.asString)

        val TransactionTimedOut = AmazonPayApiError.withReason(200, errorMessage, "TransactionTimedOut")
        TransactionTimedOut.failureReason mustBe Some(AmazonPayFatal.asString)

        val fatalError = AmazonPayApiError.withReason(200, errorMessage, "something else")
        fatalError.failureReason mustBe Some(AmazonPayFatal.asString)
      }
    }
  }
}
