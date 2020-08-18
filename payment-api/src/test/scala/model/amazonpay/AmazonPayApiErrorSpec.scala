package model.amazonpay

import org.scalatest.{Matchers, WordSpec}


class AmazonPayApiErrorSpec extends WordSpec with Matchers {

  "AmazonPayApiError" when {

    "withReason" should {
      "translate amazon errors into client side errors" in {
        val errorMessage = "error message"

        val InvalidPaymentMethod = AmazonPayApiError.withReason(200, errorMessage, "InvalidPaymentMethod")
        InvalidPaymentMethod.failureReason shouldBe Some(AmazonPayApiError.TryAnotherCard)

        val ProcessingFailure = AmazonPayApiError.withReason(200, errorMessage, "ProcessingFailure")
        ProcessingFailure.failureReason shouldBe Some(AmazonPayApiError.TryAgain)

        val TransactionTimedOut = AmazonPayApiError.withReason(200, errorMessage, "TransactionTimedOut")
        TransactionTimedOut.failureReason shouldBe Some(AmazonPayApiError.Fatal)

        val fatalError = AmazonPayApiError.withReason(200, errorMessage, "something else")
        fatalError.failureReason shouldBe Some(AmazonPayApiError.Fatal)
      }
    }
  }
}
