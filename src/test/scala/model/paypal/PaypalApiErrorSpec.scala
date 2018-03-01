package model.paypal

import com.paypal.api.payments.{Error, ErrorDetails}
import com.paypal.base.rest.PayPalRESTException
import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.mockito.MockitoSugar
import org.mockito.Mockito
import scala.collection.JavaConverters._

class PaypalApiErrorSpec extends FlatSpec with Matchers with MockitoSugar {

  behavior of "Paypal Api Error"

  it should "return error from String" in {
    val errorMessage = "error message"
    val testObj = PaypalApiError.fromString(errorMessage)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, errorMessage))
  }

  it should "return error from Exception" in {
    val errorMessage = "error message"
    val exception = new Exception(errorMessage)
    val testObj = PaypalApiError.fromThrowable(exception)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, errorMessage))
  }


  it should "return error from PayPalRESTException - PaymentAlreadyDone" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("PAYMENT_ALREADY_DONE")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.PaymentAlreadyDone, "Unknown error message"))
  }

  it should "return error from PayPalRESTException - ValidationError" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("VALIDATION_ERROR")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.ValidationError, "Unknown error message"))
  }

  it should "return error from PayPalRESTException - NotFound" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("INVALID_RESOURCE_ID")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.NotFound, "Unknown error message"))
  }

  it should "return error from PayPalRESTException - InstrumentDeclined" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("INSTRUMENT_DECLINED")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.InstrumentDeclined, "Unknown error message"))
  }

  it should "return error from PayPalRESTException - Other" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("Other")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "Unknown error message"))
  }

  it should "return error from PayPalRESTException - 401 from paypal" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(payPalRESTException.getResponsecode).thenReturn(401)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "401 - Client Authentication failed"))
  }

  it should "return error from PayPalRESTException - error message form paypal" in {
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("Other")
    Mockito.when(error.getMessage).thenReturn("Error message from paypal")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "Error message from paypal"))
  }

  it should "return error from PayPalRESTException - issue message form paypal" in {
    val issueErrorList = List(new ErrorDetails("field1", "issue1"), new ErrorDetails("field2", "issue2")).asJava
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("Other")
    Mockito.when(error.getDetails).thenReturn(issueErrorList)
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "issue1 - issue2"))
  }


  it should "return error from PayPalRESTException - error & issue message form paypal" in {
    val issueErrorList = List(new ErrorDetails("field1", "issue1"), new ErrorDetails("field2", "issue2")).asJava
    val payPalRESTException = mock[PayPalRESTException]
    val error = mock[Error]
    Mockito.when(error.getName).thenReturn("Other")
    Mockito.when(error.getDetails).thenReturn(issueErrorList)
    Mockito.when(error.getMessage).thenReturn("Error message from paypal")
    Mockito.when(payPalRESTException.getDetails).thenReturn(error)
    val testObj = PaypalApiError.fromThrowable(payPalRESTException)
    testObj shouldBe(PaypalApiError(PaypalErrorType.Other, "Error message from paypal - issue1 - issue2"))
  }

}
