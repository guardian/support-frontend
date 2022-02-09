package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend._
import cats.data.EitherT
import cats.implicits._
import com.paypal.api.payments.{Links, Payment}
import model.DefaultThreadPool
import model.paypal.{EnrichedPaypalPayment, PaypalApiError}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import play.api._
import play.api.http.Status
import play.api.libs.json.Json._
import play.api.mvc._
import play.api.routing.Router
import play.api.test.Helpers._
import play.api.test._
import router.Routes
import services.CloudWatchService
import util.RequestBasedProvider

import scala.jdk.CollectionConverters._
import scala.concurrent.{ExecutionContext, Future}

class PaypalControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context)
    extends BuiltInComponentsFromContext(context)
    with MockitoSugar {

  val mockPaypalBackend: PaypalBackend =
    mock[PaypalBackend]

  val mockPaypalRequestBasedProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  val enrichedPaymentMock: EnrichedPaypalPayment = mock[EnrichedPaypalPayment]

  val paymentMock: Payment = mock[Payment]

  val paymentServiceResponse: EitherT[Future, PaypalApiError, Payment] =
    EitherT.right(Future.successful(paymentMock))

  val paymentServiceResponseError: EitherT[Future, PaypalApiError, Payment] =
    EitherT.left(Future.successful(PaypalApiError.fromString("Error response")))

  val enrichedPaymentServiceResponse: EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    EitherT.right(Future.successful(enrichedPaymentMock))

  val enrichedPaymentServiceResponseError: EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    EitherT.left(Future.successful(PaypalApiError.fromString("Error response")))

  val paymentHookResponse: EitherT[Future, BackendError, Unit] =
    EitherT.right(Future.successful(()))

  val paymentHookResponseError: EitherT[Future, BackendError, Unit] =
    EitherT.left(Future.successful(BackendError.fromPaypalAPIError(PaypalApiError.fromString("Error response"))))

  val payPalController: PaypalController =
    new PaypalController(controllerComponents, mockPaypalRequestBasedProvider)(
      DefaultThreadPool(ec),
      List("https://cors.com"),
    )

  val mockAmazonPayController: AmazonPayController = mock[AmazonPayController]

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    mock[RequestBasedProvider[StripeBackend]]

  val goCardlessBackendProvider: RequestBasedProvider[GoCardlessBackend] =
    mock[RequestBasedProvider[GoCardlessBackend]]

  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents)(DefaultThreadPool(ec), List.empty),
    new StripeController(controllerComponents, stripeBackendProvider, mockCloudWatchService)(
      DefaultThreadPool(ec),
      List.empty,
    ),
    payPalController,
    new GoCardlessController(controllerComponents, goCardlessBackendProvider)(DefaultThreadPool(ec), List.empty),
    mockAmazonPayController,
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class PaypalControllerSpec extends AnyWordSpec with Status with Matchers {

  implicit val actorSystem = ActorSystem("rest-server")
  implicit val materializer: Materializer = ActorMaterializer()
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val context = ApplicationLoader.Context.create(Environment.simple())

  "Paypal Controller" when {

    "a request is made to create a payment" should {

      val fixtureFor200Response = new PaypalControllerFixture()(executionContext, context) {
        val link = new Links("http://return-url.com", "approval_url")
        val links: java.util.List[Links] = List(link).asJava
        when(enrichedPaymentMock.payment)
          .thenReturn(paymentMock)
        when(paymentMock.getLinks)
          .thenReturn(links)
        when(paymentMock.getId)
          .thenReturn("paymentID")
        when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
          .thenReturn(mockPaypalBackend)
        when(mockPaypalBackend.createPayment(any()))
          .thenReturn(paymentServiceResponse)
      }

      "return a 200 response if the request is valid and the amount is an integer" in {
        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse("""
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "returnURL": "http://return-url.com/return",
              |  "cancelURL": "http://return-url.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixtureFor200Response.payPalController.createPayment, createPaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and the amount has a decimal point" in {
        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse("""
              |{
              |  "currency": "GBP",
              |  "amount": 1.23,
              |  "returnURL": "http://return-url.com/return",
              |  "cancelURL": "http://return-url.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixtureFor200Response.payPalController.createPayment, createPaymentRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 400 response if the request contains an invalid amount" in {
        val fixture = new PaypalControllerFixture()(executionContext, context)
        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse("""
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
          .withJsonBody(parse("""
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

          import scala.jdk.CollectionConverters._

          val link = new Links("invalidURL", "approval_url")
          val links: java.util.List[Links] = List(link).asJava
          when(enrichedPaymentMock.payment)
            .thenReturn(paymentMock)
          when(paymentMock.getLinks)
            .thenReturn(links)
          when(paymentMock.getId)
            .thenReturn("paymentID")
          when(
            mockPaypalRequestBasedProvider
              .getInstanceFor(any())(any()),
          )
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.createPayment(any()))
            .thenReturn(paymentServiceResponseError)
        }

        val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment")
          .withJsonBody(parse("""
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

      "return a 200 response if the request is valid using the old format - full request" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
        }

        val capturePaymentRequest =
          FakeRequest("POST", "/contribute/one-off/paypal/capture-payment").withJsonBody(parse("""
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
            |  ],
            |  "queryParameters": [
            |   {
            |      "name":"param1",
            |      "value":"val1"
            |    },
            |    {
            |      "name":"param2",
            |      "value":"val2"
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
          when(mockPaypalBackend.capturePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
        }

        val capturePaymentRequest =
          FakeRequest("POST", "/contribute/one-off/paypal/capture-payment").withJsonBody(parse("""
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

      "return a 200 response if the request is valid using the new format - full request" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.capturePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse("""
            |{
            |  "paymentData": {
            |    "paymentId": "PAY-4JG67395EA359543HLKKVTFI"
            |  },
            |  "acquisitionData": {
            |    "platform": "android",
            |    "visitId": "ophanVisitId",
            |    "browserId": "ophanBrowserId",
            |    "pageviewId": "jducx5kjl3u7cwf5ocud",
            |    "referrerPageviewId": "refererPageviewId",
            |    "referrerUrl": "refererUrl",
            |    "componentId": "componentId",
            |    "campaignCodes": ["cmp", "intCmp"],
            |    "componentType": "AcquisitionsEditorialLink",
            |    "source": "GuardianWeb",
            |    "abTests": [
            |        {
            |          "name":"a-checkout",
            |          "variant":"a-stripe"
            |        },
            |        {
            |          "name":"b-checkout",
            |          "variant":"b-stripe"
            |        }
            |      ]
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
          when(mockPaypalBackend.capturePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse("""
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
          when(mockPaypalBackend.capturePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse("""
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
          when(mockPaypalBackend.capturePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponseError)
        }

        val capturePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/capture-payment")
          .withJsonBody(parse("""
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

      "return a 200 response if the request is valid - full request" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.executePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
          when(enrichedPaymentMock.email)
            .thenReturn(Some("a@b.com"))
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse("""
            |{
            |  "paymentData": {
            |    "paymentId": "PAY-3JE44966X7714540ELKLL2YY",
            |    "payerId": "3VNCN9NDEGRGW"
            |  },
            |  "acquisitionData": {
            |    "platform": "android",
            |    "visitId": "ophanVisitId",
            |    "browserId": "ophanBrowserId",
            |    "pageviewId": "jducx5kjl3u7cwf5ocud",
            |    "referrerPageviewId": "refererPageviewId",
            |    "referrerUrl": "refererUrl",
            |    "componentId": "componentId",
            |    "campaignCodes": ["cmp", "intCmp"],
            |    "componentType": "AcquisitionsEditorialLink",
            |    "source": "GuardianWeb",
            |    "abTests": [
            |        {
            |          "name":"a-checkout",
            |          "variant":"a-stripe"
            |        },
            |        {
            |          "name":"b-checkout",
            |          "variant":"b-stripe"
            |        }
            |      ]
            |  },
            | "email": "a@b.com"
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
          when(mockPaypalBackend.executePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse("""
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
          when(mockPaypalBackend.executePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponseError)
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse("""
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
              |  "email": "a@b.com"
              |}
            """.stripMargin))

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.executePayment, executePaymentRequest)

        status(paypalControllerResult).mustBe(500)
      }

      "return cors headers if origin matches existing config definition" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.executePayment(any(), any()))
            .thenReturn(enrichedPaymentServiceResponse)
          when(enrichedPaymentMock.email)
            .thenReturn(Some("a@b.com"))
        }

        val executePaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/execute-payment")
          .withJsonBody(parse("""
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
              |  "email": "a@b.com"
              |}
            """.stripMargin))
          .withHeaders("origin" -> "https://cors.com")

        val paypalControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.payPalController.executePayment, executePaymentRequest)

        val headerResponse = headers(paypalControllerResult)
        headerResponse.get("Access-Control-Allow-Origin").mustBe(Some("https://cors.com"))
        headerResponse.get("Access-Control-Allow-Headers").mustBe(Some("Origin, Content-Type, Accept"))
        headerResponse.get("Access-Control-Allow-Credentials").mustBe(Some("true"))
      }

    }

    "a request is made to refund a payment" should {

      "return a 200 response if the request is valid" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.processRefundHook(any()))
            .thenReturn(paymentHookResponse)
        }

        val paypalHookRequest = FakeRequest("POST", "/contribute/one-off/paypal/refund")
          .withJsonBody(parse("""
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
          Helpers.call(fixture.payPalController.processRefund, paypalHookRequest)

        status(paypalControllerResult).mustBe(200)
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.processRefundHook(any()))
            .thenReturn(paymentHookResponse)
        }

        val paypalHookRequest = FakeRequest("POST", "/contribute/one-off/paypal/refund")
          .withJsonBody(parse("""
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
          Helpers.call(fixture.payPalController.processRefund, paypalHookRequest)

        status(paypalControllerResult).mustBe(400)
      }

      "return a 500 response if the response from the service contains an error" in {
        val fixture = new PaypalControllerFixture()(executionContext, context) {
          when(mockPaypalRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockPaypalBackend)
          when(mockPaypalBackend.processRefundHook(any()))
            .thenReturn(paymentHookResponseError)
        }

        val paypalHookRequest = FakeRequest("POST", "/contribute/one-off/paypal/refund")
          .withJsonBody(parse("""
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
          Helpers.call(fixture.payPalController.processRefund, paypalHookRequest)

        status(paypalControllerResult).mustBe(500)
      }

    }
  }
}
