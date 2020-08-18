package model.paypal

import com.paypal.api.payments.{Error, ErrorDetails}
import com.paypal.base.rest.PayPalRESTException
import org.mockito.Mockito._
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

import scala.collection.JavaConverters._

class PaypalApiErrorSpec extends AnyWordSpec with Matchers with MockitoSugar {

  "PaypalApiError" when {

    "a String is given" should {
      "build a PaypalApiError" in {
        val errorMessage = "error message"
        val testObj = PaypalApiError.fromString(errorMessage)
        testObj mustBe PaypalApiError(None, None, errorMessage)
      }
    }
    "an Exception is given" should {
      "build a PaypalApiError" in {
        val errorMessage = "error message"
        val exception = new Exception(errorMessage)
        val testObj = PaypalApiError.fromThrowable(exception)
        testObj mustBe PaypalApiError.fromString(errorMessage)
      }
    }
    "an PayPalRESTException is given" should {
      "build a PaypalApiError if the type is: PaymentAlreadyDone" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("PAYMENT_ALREADY_DONE")
        when(payPalRESTException.getDetails).thenReturn(error)
        when(payPalRESTException.getResponsecode).thenReturn(400)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj mustBe PaypalApiError(Some(400), Some("PAYMENT_ALREADY_DONE"), "Unknown error message")
      }
      "build a PaypalApiError if paypal return response status code 401" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(payPalRESTException.getResponsecode).thenReturn(401)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj mustBe PaypalApiError(Some(401), None, "Unknown error message")
      }
      "build a PaypalApiError if paypal error contains an error message" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("")
        when(error.getMessage).thenReturn("Error message from paypal")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj mustBe PaypalApiError(Some(0), None, "Error message from paypal")
      }
      "build a PaypalApiError if paypal error contains an issue message" in {
        val issueErrorList = List(new ErrorDetails("field1", "issue1"), new ErrorDetails("field2", "issue2")).asJava
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("")
        when(error.getDetails).thenReturn(issueErrorList)
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj mustBe PaypalApiError(Some(0), None, "issue1 - issue2")
      }
      "build a PaypalApiError if paypal error contains an error & issue message" in {
        val issueErrorList = List(new ErrorDetails("field1", "issue1"), new ErrorDetails("field2", "issue2")).asJava
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("")
        when(error.getDetails).thenReturn(issueErrorList)
        when(error.getMessage).thenReturn("Error message from paypal")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj mustBe PaypalApiError(Some(0), None, "Error message from paypal - issue1 - issue2")
      }
    }
  }
}
