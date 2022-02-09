package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend._
import cats.data.EitherT
import cats.implicits._
import com.stripe.exception.{CardException, InvalidRequestException}
import com.stripe.model.{Charge, Event}
import model.DefaultThreadPool
import model.stripe.{StripeApiError, StripeCreateChargeResponse}
import org.mockito.Mockito._
import org.mockito.ArgumentMatchers.any
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import play.api._
import play.api.http.Status
import play.api.inject.DefaultApplicationLifecycle
import play.api.libs.json.Json
import play.api.libs.json.Json._
import play.api.mvc._
import play.api.routing.Router
import play.api.test.Helpers._
import play.api.test._
import play.core.DefaultWebCommands
import router.Routes
import services.CloudWatchService
import util.RequestBasedProvider

import scala.concurrent.{ExecutionContext, Future}

class StripeControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context)
    extends BuiltInComponentsFromContext(context)
    with MockitoSugar {

  val mockCharge: Charge =
    mock[Charge]

  when(mockCharge.getCurrency).thenReturn("GBP")
  when(mockCharge.getAmount).thenReturn(1L)

  val mockStripeBackend: StripeBackend =
    mock[StripeBackend]

  val mockStripeRequestBasedProvider: RequestBasedProvider[StripeBackend] =
    mock[RequestBasedProvider[StripeBackend]]

  val stripeChargeSuccessMock: StripeCreateChargeResponse = StripeCreateChargeResponse.fromCharge(mockCharge)

  val stripeServiceResponse: EitherT[Future, StripeApiError, StripeCreateChargeResponse] =
    EitherT.right(Future.successful(stripeChargeSuccessMock))

  val stripeServiceInvalidRequestErrorResponse: EitherT[Future, StripeApiError, StripeCreateChargeResponse] =
    EitherT.leftT[Future, StripeCreateChargeResponse](
      StripeApiError.fromThrowable(
        new InvalidRequestException("failure", "param1", "id12345", "code", 500, new Throwable),
        None,
      ),
    )

  val stripeServiceCardErrorResponse: EitherT[Future, StripeApiError, StripeCreateChargeResponse] =
    EitherT.leftT[Future, StripeCreateChargeResponse](
      StripeApiError.fromStripeException(
        new CardException("failure", "id12345", "001", "param1", "card_not_supported", "charge1", 400, new Throwable),
        None,
      ),
    )

  val mockEvent: Event = mock[Event]

  val processRefundHookSuccess: EitherT[Future, BackendError, Unit] =
    EitherT.right(Future.successful(()))

  val processRefundHookFailure: EitherT[Future, BackendError, Unit] =
    EitherT.leftT[Future, Unit](BackendError.fromStripeApiError(StripeApiError.fromString("Error response", None)))

  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  val stripeController: StripeController =
    new StripeController(controllerComponents, mockStripeRequestBasedProvider, mockCloudWatchService)(
      DefaultThreadPool(ec),
      List("https://cors.com"),
    )

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  val goCardlessBackendProvider: RequestBasedProvider[GoCardlessBackend] =
    mock[RequestBasedProvider[GoCardlessBackend]]

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents)(DefaultThreadPool(ec), List.empty),
    stripeController,
    new PaypalController(controllerComponents, paypalBackendProvider)(DefaultThreadPool(ec), List.empty),
    new GoCardlessController(controllerComponents, goCardlessBackendProvider)(DefaultThreadPool(ec), List.empty),
    mock[AmazonPayController],
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class StripeControllerSpec extends AnyWordSpec with Status with Matchers {

  implicit val actorSystem = ActorSystem("rest-server")
  implicit val materializer: Materializer = ActorMaterializer()
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val context = ApplicationLoader.Context.create(Environment.simple())

  "StripeController" when {

    "a request is made to create a payment" should {

      "return a 200 response if the request is valid and sent using the old format - full request" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "token": "token",
              |  "email": "email",
              |  "ophanVisitId": "ophanVisitId",
              |  "ophanBrowserId": "ophanBrowserId",
              |  "ophanPageviewId": "jducx5kjl3u7cwf5ocud",
              |  "refererPageviewId": "refererPageviewId",
              |  "refererUrl": "refererUrl",
              |  "platform": "android",
              |  "cmp": "cmp",
              |  "intCmp": "intCmp",
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
              |  ],
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and sent using the old format with the minimal params" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "token": "token",
              |  "email": "email@theguardian.com"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and sent using the new format - full request" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1,
              |    "token": "token",
              |    "email": "email@theguardian.com"
              |  },
              |  "acquisitionData": {
              |    "platform": "android",
              |    "visitId": "visitId",
              |    "browserId": "ophanBrowserId",
              |    "pageviewId": "ophanPageviewId",
              |    "referrerPageviewId": "refererPageviewId",
              |    "referrerUrl": "refererUrl",
              |    "componentId": "componentId",
              |    "campaignCodes" : ["code", "code2"],
              |    "componentType": "AcquisitionsOther",
              |    "source": "GuardianWeb",
              |    "nativeAbTests":[
              |       {
              |         "name":"a-checkout",
              |         "variant":"a-stripe"
              |       },
              |       {
              |         "name":"b-checkout",
              |         "variant":"b-stripe"
              |       }
              |     ]
              |  },
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and the amount contains a decimal point - full request" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1.23,
              |    "token": "token",
              |    "email": "email@theguardian.com"
              |  },
              |  "acquisitionData": {
              |    "platform": "android",
              |    "visitId": "visitId",
              |    "browserId": "ophanBrowserId",
              |    "pageviewId": "ophanPageviewId",
              |    "referrerPageviewId": "refererPageviewId",
              |    "referrerUrl": "refererUrl",
              |    "componentId": "componentId",
              |    "campaignCodes" : ["code", "code2"],
              |    "componentType": "AcquisitionsOther",
              |    "source": "GuardianWeb",
              |    "nativeAbTests":[
              |       {
              |         "name":"a-checkout",
              |         "variant":"a-stripe"
              |       },
              |       {
              |         "name":"b-checkout",
              |         "variant":"b-stripe"
              |       }
              |     ]
              |  },
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and no publicKey is passed in - backwards compatible request" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1.23,
              |    "token": "token",
              |    "email": "email@theguardian.com"
              |  },
              |  "acquisitionData": {
              |    "platform": "android",
              |    "visitId": "visitId",
              |    "browserId": "ophanBrowserId",
              |    "pageviewId": "ophanPageviewId",
              |    "referrerPageviewId": "refererPageviewId",
              |    "referrerUrl": "refererUrl",
              |    "componentId": "componentId",
              |    "campaignCodes" : ["code", "code2"],
              |    "componentType": "AcquisitionsOther",
              |    "source": "GuardianWeb",
              |    "nativeAbTests":[
              |       {
              |         "name":"a-checkout",
              |         "variant":"a-stripe"
              |       },
              |       {
              |         "name":"b-checkout",
              |         "variant":"b-stripe"
              |       }
              |     ]
              |  }
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return cors headers if origin matches existing config definition" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1.23,
              |    "token": "token",
              |    "email": "email@theguardian.com"
              |  },
              |  "acquisitionData": {
              |    "platform": "android"
              |  },
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))
          .withHeaders("origin" -> "https://cors.com")

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        val headerResponse = headers(stripeControllerResult)
        headerResponse.get("Access-Control-Allow-Origin").mustBe(Some("https://cors.com"))
        headerResponse.get("Access-Control-Allow-Headers").mustBe(Some("Origin, Content-Type, Accept"))
        headerResponse.get("Access-Control-Allow-Credentials").mustBe(Some("true"))
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1,
              |    "token": "token",
              |    "email": "email@theguardian.com"
              |  },
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(400)
      }

      "return a 400 response with an appropriate failure reason if the request contains an empty token" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
            {
              "paymentData": {
                "currency": "GBP",
                "amount": 1.23,
                "token": "",
                "email": "email@theguardian.com"
              },
              "acquisitionData": {
                "platform": "android"
              }
            }
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(400)

        val expectedBody =
          Json.obj(
            "type" -> "error",
            "error" -> "Empty string is not permitted for this field: DownField(token),DownField(paymentData)",
          )
        contentAsJson(stripeControllerResult).mustBe(expectedBody)

      }

      "return a 402 response with an appropriate failure reason if the response from the service contains a CardException" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceCardErrorResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "token": "token",
              |  "email": "email@theguardian.com",
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(402)

        val expectedBody =
          Json.obj("type" -> "error", "error" -> Json.obj("failureReason" -> "payment_method_unacceptable"))
        contentAsJson(stripeControllerResult).mustBe(expectedBody)

      }

      "return a 500 response if the response from the service contains an error (other than a CardException)" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any(), any()))
            .thenReturn(stripeServiceInvalidRequestErrorResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/execute-payment")
          .withJsonBody(parse("""
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "token": "token",
              |  "email": "email@theguardian.com",
              |  "publicKey": "pk_test_FOO"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(500)

        val expectedBody = Json.obj("type" -> "error", "error" -> Json.obj("failureReason" -> "unknown"))
        contentAsJson(stripeControllerResult).mustBe(expectedBody)
      }
    }

    "a request is made to refund a payment" should {

      "return a 200 response if the request is valid" in {

        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.processRefundHook(any()))
            .thenReturn(processRefundHookSuccess)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }

        // TODO: seems like the route in FakeRequest can be anything and test will pass. Find out why!
        val stripeHookRequest = FakeRequest("POST", "/contribute/one-off/stripe/refund")
          .withJsonBody(parse("""
              |{
              |  "id": "evt_1C5u5ECbpG0cQtlbRqzhzght",
              |  "object": "event",
              |  "api_version": "2016-03-07",
              |  "created": 1521112640,
              |  "data": {
              |    "object": {
              |      "id": "ch_1C5dM5CbpG0cQtlbH7dCaMmB",
              |      "object": "charge",
              |      "amount": 5000,
              |      "amount_refunded": 5000,
              |      "application": null,
              |      "application_fee": null,
              |      "balance_transaction": "txn_1C5dM5CbpG0cQtlbWHSjLu2H",
              |      "captured": true,
              |      "created": 1521048337,
              |      "currency": "gbp",
              |      "customer": null,
              |      "description": "Your contribution",
              |      "destination": null,
              |      "dispute": null,
              |      "failure_code": null,
              |      "failure_message": null,
              |      "fraud_details": {},
              |      "invoice": null,
              |      "livemode": false,
              |      "metadata": {
              |        "contributionId": "67dba1aa-5c4b-4828-a00d-64f82cc7465d",
              |        "countrySubdivisionCode": "unknown-country-subdivision-code",
              |        "ophanPageviewId": "jercw9q8cp285gk2o9oz",
              |        "email": "jsmith@gu.com",
              |        "name": "john smith",
              |        "countryCode": "unknown-country-code"
              |      },
              |      "on_behalf_of": null,
              |      "order": null,
              |      "outcome": {
              |        "network_status": "approved_by_network",
              |        "reason": null,
              |        "risk_level": "normal",
              |        "seller_message": "Payment complete.",
              |        "type": "authorized"
              |      },
              |      "paid": true,
              |      "receipt_email": "jsmith@gu.com",
              |      "receipt_number": null,
              |      "refunded": true,
              |      "refunds": {
              |        "object": "list",
              |        "data": [
              |          {
              |            "id": "re_1C5u5DCbpG0cQtlbdbTu6iWX",
              |            "object": "refund",
              |            "amount": 5000,
              |            "balance_transaction": "txn_1C5u5DCbpG0cQtlbSWmY2OMh",
              |            "charge": "ch_1C5dM5CbpG0cQtlbH7dCaMmB",
              |            "created": 1521112639,
              |            "currency": "gbp",
              |            "metadata": {},
              |            "reason": null,
              |            "receipt_number": null,
              |            "status": "succeeded"
              |          }
              |        ],
              |        "has_more": false,
              |        "total_count": 1,
              |        "url": "/v1/charges/ch_1C5dM5CbpG0cQtlbH7dCaMmB/refunds"
              |      },
              |      "review": null,
              |      "shipping": null,
              |      "source": {
              |        "id": "card_1C5dM1CbpG0cQtlbwg3Es6dh",
              |        "object": "card",
              |        "address_city": null,
              |        "address_country": null,
              |        "address_line1": null,
              |        "address_line1_check": null,
              |        "address_line2": null,
              |        "address_state": null,
              |        "address_zip": null,
              |        "address_zip_check": null,
              |        "brand": "Visa",
              |        "country": "US",
              |        "customer": null,
              |        "cvc_check": "pass",
              |        "dynamic_last4": null,
              |        "exp_month": 2,
              |        "exp_year": 2022,
              |        "fingerprint": "6Hu7pNVx490p6mah",
              |        "funding": "credit",
              |        "last4": "4242",
              |        "metadata": {},
              |        "name": "jsmith@gu.com",
              |        "tokenization_method": null
              |      },
              |      "source_transfer": null,
              |      "statement_descriptor": null,
              |      "status": "succeeded",
              |      "transfer_group": null
              |    },
              |    "previous_attributes": {
              |      "amount_refunded": 0,
              |      "refunded": false,
              |      "refunds": {
              |        "data": [],
              |        "total_count": 0
              |      }
              |    }
              |  },
              |  "livemode": false,
              |  "pending_webhooks": 1,
              |  "request": "req_DlkTIMVC94IJ7X",
              |  "type": "charge.refunded"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.processRefund, stripeHookRequest)

        status(stripeControllerResult).mustBe(200)

      }

      "return a 400 response if the request contains an invalid JSON" in {

        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.processRefundHook(any()))
            .thenReturn(processRefundHookSuccess)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }

        val stripeHookRequest = FakeRequest("POST", "/contribute/one-off/stripe/hook")
          .withJsonBody(parse("""
              |{
              |  "object": "event",
              |  "api_version": "2016-03-07",
              |  "created": 1521112640,
              |  "livemode": false,
              |  "pending_webhooks": 1,
              |  "request": "req_DlkTIMVC94IJ7X",
              |  "type": "charge.refunded"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.processRefund, stripeHookRequest)

        status(stripeControllerResult).mustBe(400)

      }

      "return a 500 response if the response from the service contains an error" in {

        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.processRefundHook(any()))
            .thenReturn(processRefundHookFailure)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }

        val stripeHookRequest = FakeRequest("POST", "/contribute/one-off/stripe/hook")
          .withJsonBody(parse("""
              |{
              |  "id": "evt_1C5u5ECbpG0cQtlbRqzhzght",
              |  "object": "event",
              |  "api_version": "2016-03-07",
              |  "created": 1521112640,
              |  "data": {
              |    "object": {
              |      "id": "ch_1C5dM5CbpG0cQtlbH7dCaMmB",
              |      "object": "charge",
              |      "amount": 5000,
              |      "amount_refunded": 5000,
              |      "application": null,
              |      "application_fee": null,
              |      "balance_transaction": "txn_1C5dM5CbpG0cQtlbWHSjLu2H",
              |      "captured": true,
              |      "created": 1521048337,
              |      "currency": "gbp",
              |      "customer": null,
              |      "description": "Your contribution",
              |      "destination": null,
              |      "dispute": null,
              |      "failure_code": null,
              |      "failure_message": null,
              |      "fraud_details": {},
              |      "invoice": null,
              |      "livemode": false,
              |      "metadata": {
              |        "contributionId": "67dba1aa-5c4b-4828-a00d-64f82cc7465d",
              |        "countrySubdivisionCode": "unknown-country-subdivision-code",
              |        "ophanPageviewId": "jercw9q8cp285gk2o9oz",
              |        "email": "jsmith@gu.com",
              |        "name": "john smith",
              |        "countryCode": "unknown-country-code"
              |      },
              |      "on_behalf_of": null,
              |      "order": null,
              |      "outcome": {
              |        "network_status": "approved_by_network",
              |        "reason": null,
              |        "risk_level": "normal",
              |        "seller_message": "Payment complete.",
              |        "type": "authorized"
              |      },
              |      "paid": true,
              |      "receipt_email": "jsmith@gu.com",
              |      "receipt_number": null,
              |      "refunded": true,
              |      "refunds": {
              |        "object": "list",
              |        "data": [
              |          {
              |            "id": "re_1C5u5DCbpG0cQtlbdbTu6iWX",
              |            "object": "refund",
              |            "amount": 5000,
              |            "balance_transaction": "txn_1C5u5DCbpG0cQtlbSWmY2OMh",
              |            "charge": "ch_1C5dM5CbpG0cQtlbH7dCaMmB",
              |            "created": 1521112639,
              |            "currency": "gbp",
              |            "metadata": {},
              |            "reason": null,
              |            "receipt_number": null,
              |            "status": "succeeded"
              |          }
              |        ],
              |        "has_more": false,
              |        "total_count": 1,
              |        "url": "/v1/charges/ch_1C5dM5CbpG0cQtlbH7dCaMmB/refunds"
              |      },
              |      "review": null,
              |      "shipping": null,
              |      "source": {
              |        "id": "card_1C5dM1CbpG0cQtlbwg3Es6dh",
              |        "object": "card",
              |        "address_city": null,
              |        "address_country": null,
              |        "address_line1": null,
              |        "address_line1_check": null,
              |        "address_line2": null,
              |        "address_state": null,
              |        "address_zip": null,
              |        "address_zip_check": null,
              |        "brand": "Visa",
              |        "country": "US",
              |        "customer": null,
              |        "cvc_check": "pass",
              |        "dynamic_last4": null,
              |        "exp_month": 2,
              |        "exp_year": 2022,
              |        "fingerprint": "6Hu7pNVx490p6mah",
              |        "funding": "credit",
              |        "last4": "4242",
              |        "metadata": {},
              |        "name": "jsmith@gu.com",
              |        "tokenization_method": null
              |      },
              |      "source_transfer": null,
              |      "statement_descriptor": null,
              |      "status": "succeeded",
              |      "transfer_group": null
              |    },
              |    "previous_attributes": {
              |      "amount_refunded": 0,
              |      "refunded": false,
              |      "refunds": {
              |        "data": [],
              |        "total_count": 0
              |      }
              |    }
              |  },
              |  "livemode": false,
              |  "pending_webhooks": 1,
              |  "request": "req_DlkTIMVC94IJ7X",
              |  "type": "charge.refunded"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.processRefund, stripeHookRequest)

        status(stripeControllerResult).mustBe(500)

      }

    }
  }
}
