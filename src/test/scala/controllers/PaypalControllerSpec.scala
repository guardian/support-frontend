package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend.BackendError
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

  val paymentServiceResponse: EitherT[Future, BackendError, Payment] =
    EitherT.right(Future.successful(paymentMock))

  val paymentServiceResponseError: EitherT[Future, BackendError, Payment] =
    EitherT.left(Future.successful(BackendError.PaypalApiError(PaypalApiError.fromString("Error response"))))

  val paymentHookResponse: EitherT[Future, PaypalApiError, Unit] =
    EitherT.right(Future.successful(()))

  val paymentHookResponseError: EitherT[Future, PaypalApiError, Unit] =
    EitherT.left(Future.successful(PaypalApiError.fromString("Error response")))

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
            | "signedInUserEmail": "a@b.com"
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

    "a request is made to hook a payment" should {

      "return a 200 response if the request is valid" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.processPaymentHook(any(), any(), any())(any()))
            .thenReturn(paymentHookResponse)
        }

        val paypalHookRequest = FakeRequest("POST", "/contribute/one-off/paypal/hook")
          .withJsonBody(parse(
            """
              |{
              |  "id": "WH-234356782L664583L-6EC47963K52069449",
              |  "event_version": "1.0",
              |  "create_time": "2018-03-14T10:19:20.311Z",
              |  "resource_type": "capture",
              |  "event_type": "PAYMENT.CAPTURE.REFUNDED",
              |  "summary": "Payment refunded for GBP 30.11 GBP",
              |  "resource": {
              |    "id": "34T354018L637914T",
              |    "amount": {
              |      "total": "30.11",
              |      "currency": "GBP"
              |    },
              |    "state": "completed",
              |    "custom": "EBAY_EMS_90048630024435",
              |    "transaction_fee": {
              |      "value": "1.37",
              |      "currency": "GBP"
              |    },
              |    "parent_payment": "PAY-9EJ799463C973234FLKUPMZA",
              |    "invoice_number": "48787589673",
              |    "create_time": "2018-03-14T10:19:12Z",
              |    "update_time": "2018-03-14T10:19:12Z",
              |    "links": [
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/capture/34T354018L637914T",
              |        "rel": "self",
              |        "method": "GET"
              |      },
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/capture/34T354018L637914T/refund",
              |        "rel": "refund",
              |        "method": "POST"
              |      },
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/authorization/6HC70666FA593492C",
              |        "rel": "authorization",
              |        "method": "GET"
              |      },
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/payment/PAY-9EJ799463C973234FLKUPMZA",
              |        "rel": "parent_payment",
              |        "method": "GET"
              |      }
              |    ]
              |  },
              |  "links": [
              |    {
              |      "href": "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-234356782L664583L-6EC47963K52069449",
              |      "rel": "self",
              |      "method": "GET"
              |    },
              |    {
              |      "href": "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-234356782L664583L-6EC47963K52069449/resend",
              |      "rel": "resend",
              |      "method": "POST"
              |    }
              |  ]
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.hook, paypalHookRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.processPaymentHook(any(), any(), any())(any()))
            .thenReturn(paymentHookResponse)
        }

        val paypalHookRequest = FakeRequest("POST", "/contribute/one-off/paypal/hook")
          .withJsonBody(parse(
            """
              |{
              |  "transmission_id":"69cd13f0-d67a-11e5-baa3-778b53f4ae55",
              |  "transmission_time":"2016-02-18T20:01:35Z",
              |  "cert_url":"cert_url",
              |  "auth_algo":"SHA256withRSA",
              |  "transmission_sig":"lmI95Jx3Y9nhR5SJWlHVIWpg4AgFk7n9bCHSRxbrd8A9zrhdu2rMyFrmz+Zjh3s3boXB07VXCXUZy/UFzUlnGJn0wDugt7FlSvdKeIJenLRemUxYCPVoEZzg9VFNqOa48gMkvF+XTpxBeUx/kWy6B5cp7GkT2+pOowfRK7OaynuxUoKW3JcMWw272VKjLTtTAShncla7tGF+55rxyt2KNZIIqxNMJ48RDZheGU5w1npu9dZHnPgTXB9iomeVRoD8O/jhRpnKsGrDschyNdkeh81BJJMH4Ctc6lnCCquoP/GzCzz33MMsNdid7vL/NIWaCsekQpW26FpWPi/tfj8nLA==",
              |  "webhook_id":"1JE4291016473214C",
              |  "webhook_event":{
              |    "id":"8PT597110X687430LKGECATA",
              |    "create_time":"2013-06-25T21:41:28Z",
              |    "resource_type":"authorization",
              |    "event_type":"PAYMENT.SALE.COMPLETED",
              |    "summary":"A payment authorization was created"
              |  }
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.hook, paypalHookRequest)

        status(paypalControllerResult).mustBe(400)
      }

      "return a 500 response if the response from the service contains an error" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.processPaymentHook(any(), any(), any())(any()))
            .thenReturn(paymentHookResponseError)
        }

        val paypalHookRequest = FakeRequest("POST", "/contribute/one-off/paypal/hook")
          .withJsonBody(parse(
            """
              |{
              |  "id": "WH-4P785769VC1099306-60P87680RE683692M",
              |  "event_version": "1.0",
              |  "create_time": "2018-03-14T10:30:07.162Z",
              |  "resource_type": "sale",
              |  "event_type": "PAYMENT.CAPTURE.REFUNDED",
              |  "summary": "Payment refunded for GBP 10.0 GBP",
              |  "resource": {
              |    "id": "6KJ06360UW748984R",
              |    "state": "completed",
              |    "amount": {
              |      "total": "10.00",
              |      "currency": "GBP",
              |      "details": {
              |        "subtotal": "10.00"
              |      }
              |    },
              |    "payment_mode": "INSTANT_TRANSFER",
              |    "protection_eligibility": "ELIGIBLE",
              |    "protection_eligibility_type": "ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE",
              |    "transaction_fee": {
              |      "value": "0.59",
              |      "currency": "GBP"
              |    },
              |    "invoice_number": "",
              |    "custom": "14108183-96f1-47b1-86c5-e096a353103a",
              |    "parent_payment": "PAY-7EA90085PE509580KLKUPLUI",
              |    "create_time": "2018-03-14T10:14:20Z",
              |    "update_time": "2018-03-14T10:14:20Z",
              |    "links": [
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/sale/6KJ06360UW748984R",
              |        "rel": "self",
              |        "method": "GET"
              |      },
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/sale/6KJ06360UW748984R/refund",
              |        "rel": "refund",
              |        "method": "POST"
              |      },
              |      {
              |        "href": "https://api.sandbox.paypal.com/v1/payments/payment/PAY-7EA90085PE509580KLKUPLUI",
              |        "rel": "parent_payment",
              |        "method": "GET"
              |      }
              |    ]
              |  },
              |  "links": [
              |    {
              |      "href": "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-4P785769VC1099306-60P87680RE683692M",
              |      "rel": "self",
              |      "method": "GET"
              |    },
              |    {
              |      "href": "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-4P785769VC1099306-60P87680RE683692M/resend",
              |      "rel": "resend",
              |      "method": "POST"
              |    }
              |  ]
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.hook, paypalHookRequest)

        status(paypalControllerResult).mustBe(500)
      }

    }
  }
}