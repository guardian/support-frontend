package model.paypal

import com.paypal.api.payments.{Error, ErrorDetails}
import com.paypal.base.rest.PayPalRESTException
import org.scalatest.{Matchers, WordSpec}
import org.scalatest.mockito.MockitoSugar
import org.mockito.Mockito._
import scala.collection.JavaConverters._

class PaypalApiErrorSpec extends WordSpec with Matchers with MockitoSugar {

  "PaypalApiError" when {

    "a String is given" should {
      "build a PaypalApiError" in {
        val errorMessage = "error message"
        val testObj = PaypalApiError.fromString(errorMessage)
        testObj shouldBe PaypalApiError(PaypalErrorType.Other, errorMessage)
      }
    }
    "an Exception is given" should {
      "build a PaypalApiError" in {
        val errorMessage = "error message"
        val exception = new Exception(errorMessage)
        val testObj = PaypalApiError.fromThrowable(exception)
        testObj shouldBe PaypalApiError(PaypalErrorType.Other, errorMessage)
      }
    }
    "an PayPalRESTException is given" should {
      "build a PaypalApiError if the type is: PaymentAlreadyDone" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("PAYMENT_ALREADY_DONE")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe PaypalApiError(PaypalErrorType.PaymentAlreadyDone, "Unknown error message")
      }
      "build a PaypalApiError if the type is: ValidationError" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("VALIDATION_ERROR")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe PaypalApiError(PaypalErrorType.ValidationError, "Unknown error message")
      }
      "build a PaypalApiError if the type is: NotFound" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("INVALID_RESOURCE_ID")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe PaypalApiError(PaypalErrorType.NotFound, "Unknown error message")
      }
      "build a PaypalApiError if the type is: InstrumentDeclined" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("INSTRUMENT_DECLINED")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe PaypalApiError(PaypalErrorType.InstrumentDeclined, "Unknown error message")
      }
      "build a PaypalApiError if the type is: Other" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("Other")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe PaypalApiError(PaypalErrorType.Other, "Unknown error message")
      }
      "build a PaypalApiError if paypal return response status code 401" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(payPalRESTException.getResponsecode).thenReturn(401)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe PaypalApiError(PaypalErrorType.Other, "401 - Client Authentication failed")
      }
      "build a PaypalApiError if paypal error contains an error message" in {
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("Other")
        when(error.getMessage).thenReturn("Error message from paypal")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "Error message from paypal"))

      }
      "build a PaypalApiError if paypal error contains an issue message" in {
        val issueErrorList = List(new ErrorDetails("field1", "issue1"), new ErrorDetails("field2", "issue2")).asJava
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("Other")
        when(error.getDetails).thenReturn(issueErrorList)
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "issue1 - issue2"))
      }
      "build a PaypalApiError if paypal error contains an error & issue message" in {
        val issueErrorList = List(new ErrorDetails("field1", "issue1"), new ErrorDetails("field2", "issue2")).asJava
        val payPalRESTException = mock[PayPalRESTException]
        val error = mock[Error]
        when(error.getName).thenReturn("Other")
        when(error.getDetails).thenReturn(issueErrorList)
        when(error.getMessage).thenReturn("Error message from paypal")
        when(payPalRESTException.getDetails).thenReturn(error)
        val testObj = PaypalApiError.fromThrowable(payPalRESTException)
        testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "Error message from paypal - issue1 - issue2"))
      }
    }
  }
}
