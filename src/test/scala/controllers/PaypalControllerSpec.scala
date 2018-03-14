package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend.PaypalBackend.PaypalBackendError
import backend.{PaypalBackend, StripeBackend}
import cats.data.EitherT
import cats.implicits._
import com.paypal.api.payments.{Links, Payment}
import model.DefaultThreadPool
import model.paypal.PaypalApiError
import org.mockito.Matchers._
import org.mockito.Mockito._
import org.scalatest.mockito.MockitoSugar
import org.scalatestplus.play._
import play.api._
import play.api.http.Status
import play.api.inject.DefaultApplicationLifecycle
import play.api.mvc._
import play.api.routing.Router
import play.api.test.Helpers._
import play.api.test._
import play.core.DefaultWebCommands
import router.Routes
import util.RequestBasedProvider

import scala.concurrent.{ExecutionContext, Future}
import play.api.libs.json.Json._

import scala.collection.JavaConverters._

class PaypalControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context)
  extends BuiltInComponentsFromContext(context) with MockitoSugar {

  val mockPaypalBackend: PaypalBackend =
    mock[PaypalBackend]

  val mockPaypalRequestBasedProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  val paymentMock: Payment = mock[Payment]

  val paymentServiceResponse: EitherT[Future, PaypalBackendError, Payment] =
    EitherT.right(Future.successful(paymentMock))

  val paymentServiceResponseError: EitherT[Future, PaypalBackendError, Payment] =
    EitherT.left(Future.successful(PaypalBackendError.PayPalAPI(PaypalApiError.fromString("Error response"))))

  val payPalController: PaypalController =
    new PaypalController(controllerComponents, mockPaypalRequestBasedProvider)(DefaultThreadPool(ec))

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    mock[RequestBasedProvider[StripeBackend]]

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents),
    new StripeController(controllerComponents, stripeBackendProvider)(DefaultThreadPool(ec)),
    payPalController
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class PaypalControllerSpec extends PlaySpec with Status {

  implicit val actorSystem = ActorSystem("rest-server")
  implicit val materializer: Materializer = ActorMaterializer()
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val context = ApplicationLoader.Context(
    environment = Environment.simple(),
    sourceMapper = None,
    webCommands = new DefaultWebCommands(),
    initialConfiguration = Configuration.load(Environment.simple()),
    lifecycle = new DefaultApplicationLifecycle()
  )


  "Paypal Controller" when {

    "a request is made to creates a payment" should {

      "return a 200 response if the request is valid" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          val link = new Links("http://return-url.com", "approval_url")
          val links: java.util.List[Links] = List(link).asJava
          when(paymentMock.getLinks)
            .thenReturn(links)
          when(paymentMock.getId)
            .thenReturn("paymentID")
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.createPayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }
        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse(
            """
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "returnURL": "http://return-url.com/return",
              |  "cancelURL": "http://return-url.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 400 response if the request contains an invalid amount" in {
        val fixture = new PaypalControllerFixture()(executionContext, context)
        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse(
            """
              |{
              |  "currency": "GBP",
              |  "amount": "InValidAmount",
              |  "returnURL": "http://return-url.com/return",
              |  "cancelURL": "http://return-url.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)

        status(paypalControllerResult).mustBe(400)
      }

      "return a 400 response if the request contains an invalid currency" in {
        val fixture = new PaypalControllerFixture()(executionContext, context)
        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse(
            """
              |{
              |  "currency": "AAA",
              |  "amount": 1,
              |  "returnURL": "http://return-url.com/return",
              |  "cancelURL": "http://return-url.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)

        status(paypalControllerResult).mustBe(400)
      }
      "return a 500 response if the response contains an invalid return url" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {

          import scala.collection.JavaConverters._

          val link = new Links("invalidURL", "approval_url")
          val links: java.util.List[Links] = List(link).asJava
          when(paymentMock.getLinks)
            .thenReturn(links)
          when(paymentMock.getId)
            .thenReturn("paymentID")
          when(mockPaypalRequestBasedProvider
            .getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.createPayment(any())(any()))
          .thenReturn(paymentServiceResponse)
        }

        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse(
            """
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "returnURL": "invalidURL",
              |  "cancelURL": "http://return-url.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)

        status(paypalControllerResult).mustBe(500)
      }
    }


    "a request is made to capture a payment" should {

      "return a 200 response if the request is valid using the old format" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment").withJsonBody(parse(
          """
            |{
            |  "paymentId": "PAY-4JG67395EA359543HLKKVTFI",
            |  "ophanVisitId": "ophanVisitId",
            |  "ophanBrowserId": "ophanBrowserId",
            |  "platform": "android",
            |  "cmp": "cmp",
            |  "intCmp": "intCmp",
            |  "refererPageviewId": "refererPageviewId",
            |  "refererUrl": "refererUrl",
            |  "ophanPageviewId": "jducx5kjl3u7cwf5ocud",
            |  "componentId": "componentId",
            |  "componentType": "AcquisitionsEditorialLink",
            |  "source": "GuardianWeb",
            |  "idUser": "idUser",
            |  "abTest": {
            |    "name":"abTest-checkout",
            |    "variant":"abTest-stripe"
            |  },
            |  "refererAbTest": {
            |    "name":"refererAbTest-checkout",
            |    "variant":"refererAbTest-stripe"
            |  },
            |  "nativeAbTests":[
            |    {
            |      "name":"a-checkout",
            |      "variant":"a-stripe"
            |    },
            |    {
            |      "name":"b-checkout",
            |      "variant":"b-stripe"
            |    }
            |  ]
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.capturePayment, capturePaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid using the old format, minimal request from app" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment").withJsonBody(parse(
          """
            |{
            |  "platform": "android",
            |  "paymentId": "PAY-3VD06708HT420762SLKFQGNQ",
            |  "ophanBrowserId": "6971b20d-d8e0-4bf3-b5cb-37b5be1c0e83",
            |  "ophanPageviewId": "debug-settings-fragment",
            |  "intCmp": "test-cmp-code"
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.capturePayment, capturePaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid using the new format" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse(
          """
            |{
            |  "paymentData": {
            |    "paymentId": "PAY-4JG67395EA359543HLKKVTFI"
            |  },
            |  "acquisitionData": {
            |    "browserId": "ophanBrowserId",
            |    "platform": "android",
            |    "pageviewId": "ophanPageviewId",
            |    "referrerPageviewId": "refererPageviewId",
            |    "referrerUrl": "refererUrl",
            |    "componentId": "componentId",
            |    "componentType": "AcquisitionsOther",
            |    "source": "GuardianWeb"
            |  }
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.capturePayment, capturePaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 400 response if the request is missing required paymentId" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse(
          """
            |{
            |  "platform": "android",
            |  "ophanBrowserId": "6971b20d-d8e0-4bf3-b5cb-37b5be1c0e83",
            |  "ophanPageviewId": "debug-settings-fragment",
            |  "intCmp": "test-cmp-code"
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.capturePayment, capturePaymentRequest)

        status(paypalControllerResult).mustBe(400)
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse(
            """
              |{
              |  "intCmp": "intCmp",
              |  "refererPageviewId": "refererPageviewId",
              |  "refererUrl": "refererUrl",
              |  "ophanPageviewId": "jducx5kjl3u7cwf5ocud",
              |  "ophanBrowserId": "ophanBrowserId",
              |  "componentId": 5,
              |  "componentType": "AcquisitionsEditorialLink",
              |  "source":"GuardianWeb",
              |  "refererAbTest": {
              |    "name":"stripe-checkout",
              |    "variant":"stripe"
              |  },
              |  "nativeAbTests": [
              |    {
              |      "name":"stripe-checkout",
              |      "variant":"stripe"
              |    }
              |  ]
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.capturePayment, capturePaymentRequest)

        status(paypalControllerResult).mustBe(400)
      }

      "return a 500 response if the response from the service contains an error" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any())(any()))
            .thenReturn(paymentServiceResponseError)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse(
            """
              |{
              |  "paymentId": "PAY-4JG67395EA359543HLKKVTFI",
              |  "platform": "android",
              |  "intCmp": "intCmp",
              |  "refererPageviewId": "refererPageviewId",
              |  "refererUrl": "refererUrl",
              |  "ophanPageviewId": "jducx5kjl3u7cwf5ocud",
              |  "ophanBrowserId": "ophanBrowserId",
              |  "componentId": "componentId",
              |  "componentType": "AcquisitionsEditorialLink",
              |  "source": "GuardianWeb",
              |  "refererAbTest": {
              |    "name": "stripe-checkout",
              |    "variant": "stripe"
              |  },
              |  "nativeAbTests":[
              |    {
              |      "name": "stripe-checkout",
              |      "variant": "stripe"
              |    }
              |  ]
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.capturePayment, capturePaymentRequest)

        status(paypalControllerResult).mustBe(500)
      }
    }


    "a request is made to execute a payment" should {

      "return a 200 response if the request is valid" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.executePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse(
          """
            |{
            |  "paymentData": {
            |    "paymentId": "PAY-3JE44966X7714540ELKLL2YY",
            |    "payerId": "3VNCN9NDEGRGW"
            |  },
            |  "acquisitionData": {
            |    "browserId": "ophanBrowserId",
            |    "platform": "android",
            |    "pageviewId": "ophanPageviewId",
            |    "referrerPageviewId": "refererPageviewId",
            |    "referrerUrl": "refererUrl",
            |    "componentId": "componentId",
            |    "componentType": "AcquisitionsOther",
            |    "source": "GuardianWeb"
            |  },
            |  "signedInUserEmail": "a@b.com"
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.executePayment, executePaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.executePayment(any())(any()))
            .thenReturn(paymentServiceResponse)
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse(
          """
            |{
            |  "paymentData": {
            |    "paymentId": "PAY-3JE44966X7714540ELKLL2YY"
            |  }
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.executePayment, executePaymentRequest)

        status(paypalControllerResult).mustBe(400)
      }

      "return a 500 response if the response from the service contains an error" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.executePayment(any())(any()))
            .thenReturn(paymentServiceResponseError)
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse(
          """
            |{
            |  "paymentData": {
            |    "paymentId": "PAY-3JE44966X7714540ELKLL2YY",
            |    "payerId": "3VNCN9NDEGRGW"
            |  },
            |  "acquisitionData": {
            |    "browserId": "ophanBrowserId",
            |    "platform": "android",
            |    "pageviewId": "ophanPageviewId",
            |    "referrerPageviewId": "refererPageviewId",
            |    "referrerUrl": "refererUrl",
            |    "componentId": "componentId",
            |    "componentType": "AcquisitionsOther",
            |    "source": "GuardianWeb"
            |  }
            |}
          """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.executePayment, executePaymentRequest)

        status(paypalControllerResult).mustBe(500)
      }
    }
  }
}