package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend.{PaypalBackend, StripeBackend}
import cats.data.EitherT
import cats.implicits._
import backend.BackendError
import com.stripe.model.Charge
import model.DefaultThreadPool
import model.stripe.{StripeChargeError, StripeChargeSuccess}
import org.mockito.Matchers._
import org.mockito.Mockito._
import org.scalatest.mockito.MockitoSugar
import org.scalatestplus.play._
import play.api._
import play.api.http.Status
import play.api.inject.DefaultApplicationLifecycle
import play.api.libs.json.Json._
import play.api.mvc._
import play.api.routing.Router
import play.api.test.Helpers._
import play.api.test._
import play.core.DefaultWebCommands
import router.Routes
import util.RequestBasedProvider
import scala.concurrent.{ExecutionContext, Future}

class StripeControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context)
  extends BuiltInComponentsFromContext(context) with MockitoSugar {

  val mockCharge: Charge =
    mock[Charge]

  when(mockCharge.getCurrency).thenReturn("GBP")
  when(mockCharge.getAmount).thenReturn(1L)

  val mockStripeBackend: StripeBackend =
    mock[StripeBackend]

  val mockStripeRequestBasedProvider: RequestBasedProvider[StripeBackend] =
    mock[RequestBasedProvider[StripeBackend]]

  val stripeChargeSuccessMock: StripeChargeSuccess = StripeChargeSuccess.fromCharge(mockCharge)

  val stripeServiceResponse: EitherT[Future, BackendError, StripeChargeSuccess] =
    EitherT.right(Future.successful(stripeChargeSuccessMock)).leftMap(BackendError.fromStripeChargeError)

  val stripeServiceResponseError: EitherT[Future, BackendError, StripeChargeSuccess] =
    EitherT.left(Future.successful(StripeChargeError.fromThrowable(new Exception("error message")))).leftMap(BackendError.fromStripeChargeError)

  val stripeController: StripeController =
    new StripeController(controllerComponents, mockStripeRequestBasedProvider)(DefaultThreadPool(ec))

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents),
    stripeController,
    new PaypalController(controllerComponents, paypalBackendProvider)(DefaultThreadPool(ec))
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class StripeControllerSpec extends PlaySpec with Status {

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


  "StripeController" when {

    "a request is made to creates a payment" should {

      "return a 200 response if the request is valid and sent using the old format" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any())(any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/create")
          .withJsonBody(parse(
            """
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
              |  ]
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and sent using the old format with the minimal params" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any())(any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/create")
          .withJsonBody(parse(
            """
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

      "return a 200 response if the request is valid and sent using the new format" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any())(any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/create")
          .withJsonBody(parse(
            """
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
              |  }
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(200)
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any())(any()))
            .thenReturn(stripeServiceResponse)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/create")
          .withJsonBody(parse(
            """
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1,
              |    "token": "token",
              |    "email": "email@theguardian.com"
              |  }
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(400)
      }

      "return 500 response if the response from the service contains an error" in {
        val fixture = new StripeControllerFixture()(executionContext, context) {
          when(mockStripeBackend.createCharge(any())(any()))
            .thenReturn(stripeServiceResponseError)
          when(mockStripeRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockStripeBackend)
        }
        val createStripeRequest = FakeRequest("POST", "/contribute/one-off/stripe/create")
          .withJsonBody(parse(
            """
              |{
              |  "currency": "GBP",
              |  "amount": 1,
              |  "token": "token",
              |  "email": "email@theguardian.com"
              |}
            """.stripMargin))

        val stripeControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.stripeController.executePayment, createStripeRequest)

        status(stripeControllerResult).mustBe(500)
      }

    }
  }
}
