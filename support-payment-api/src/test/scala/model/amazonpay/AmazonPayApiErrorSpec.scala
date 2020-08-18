package model.amazonpay

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec


class AmazonPayApiErrorSpec extends AnyWordSpec with Matchers {

  "AmazonPayApiError" when {

    "withReason" should {
      "translate amazon errors into client side errors" in {
        val errorMessage = "error message"

        val InvalidPaymentMethod = AmazonPayApiError.withReason(200, errorMessage, "InvalidPaymentMethod")
        InvalidPaymentMethod.failureReason mustBe Some(AmazonPayApiError.TryAnotherCard)

        val ProcessingFailure = AmazonPayApiError.withReason(200, errorMessage, "ProcessingFailure")
        ProcessingFailure.failureReason mustBe Some(AmazonPayApiError.TryAgain)

        val TransactionTimedOut = AmazonPayApiError.withReason(200, errorMessage, "TransactionTimedOut")
        TransactionTimedOut.failureReason mustBe Some(AmazonPayApiError.Fatal)

        val fatalError = AmazonPayApiError.withReason(200, errorMessage, "something else")
        fatalError.failureReason mustBe Some(AmazonPayApiError.Fatal)
      }
    }
  }
}
