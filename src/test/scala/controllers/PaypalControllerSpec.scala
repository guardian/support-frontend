package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend.{PaypalBackend, StripeBackend}
import cats.data.EitherT
import cats.implicits._
import com.paypal.api.payments.{Links, Payment}
import model.DefaultThreadPool
import model.paypal.PaypalApiError
import org.mockito.{Matchers, Mockito}
import org.scalatest.concurrent.ScalaFutures
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
import services.PaypalService
import util.RequestBasedProvider

import scala.concurrent.{ExecutionContext, Future}


class PaypalControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context) extends BuiltInComponentsFromContext(context) with MockitoSugar {

  val mockPaypalService: PaypalService = mock[PaypalService]
  val mockPaypalBackend: PaypalBackend = mock[PaypalBackend]
  val mockPaypalRequestBasedProvider: RequestBasedProvider[PaypalBackend] = mock[RequestBasedProvider[PaypalBackend]]
  val mockPaypalPayment: Payment = Mockito.mock[Payment](classOf[Payment], Mockito.RETURNS_DEEP_STUBS)
  val paymentMock: Payment = mock[Payment]
  val result:EitherT[Future, PaypalApiError, Payment] = EitherT.right(Future.successful(paymentMock))
  val payPalController: PaypalController = new PaypalController(controllerComponents, mockPaypalRequestBasedProvider)(DefaultThreadPool(ec))
  val stripeBackendProvider: RequestBasedProvider[StripeBackend] = mock[RequestBasedProvider[StripeBackend]]

  override def router: Router = new Routes(
    httpErrorHandler,
    new StripeController(controllerComponents, stripeBackendProvider)(DefaultThreadPool(ec)),
    payPalController
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class PaypalControllerSpec extends PlaySpec with Status with MockitoSugar with ScalaFutures {

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

  "Paypal Controller" should {

    "create paypal payment - 200 OK" in {

      val fixture = new PaypalControllerFixture()(executionContext, context) {
        import scala.collection.JavaConverters._
        val link = new Links("http://return-url.com", "approval_url")
        val links:java.util.List[Links] = List(link).asJava
        Mockito.when(paymentMock.getLinks).thenReturn(links)
        Mockito.when(paymentMock.getId).thenReturn("paymentID")
        Mockito.when(mockPaypalRequestBasedProvider.getInstanceFor(Matchers.any())(Matchers.any())).thenReturn(mockPaypalBackend)
        Mockito.when(mockPaypalBackend.createPayment(Matchers.any())).thenReturn(result)
      }


      val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment").withJsonBody(play.api.libs.json.Json.parse(
        """{
           "currency": "GBP",
           "amount": 1,
           "returnURL": "http://return-url.com/return",
           "cancelURL": "http://return-url.com"
           }
        """.stripMargin))

      val paypalControllerResult: Future[play.api.mvc.Result] = Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)
      status(paypalControllerResult).mustBe(200)

    }

    "create paypal payment - 400 Bad Request - invalid amount" in {

      val fixture = new PaypalControllerFixture()(executionContext, context)

      val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment").withJsonBody(play.api.libs.json.Json.parse(
        """{
           "currency": "GBP",
           "amount": "InValidAmount",
           "returnURL": "http://return-url.com/return",
           "cancelURL": "http://return-url.com"
           }
        """.stripMargin))

      val paypalControllerResult: Future[play.api.mvc.Result] = Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)
      status(paypalControllerResult).mustBe(400)
    }

    "create paypal payment - 400 Bad Request - invalid currency" in {

      val fixture = new PaypalControllerFixture()(executionContext, context)

      val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment").withJsonBody(play.api.libs.json.Json.parse(
        """{
           "currency": "AAA",
           "amount": 1,
           "returnURL": "http://return-url.com/return",
           "cancelURL": "http://return-url.com"
           }
        """.stripMargin))

      val paypalControllerResult: Future[play.api.mvc.Result] = Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)
      status(paypalControllerResult).mustBe(400)
    }

    "create paypal payment - 500 Invalid return url" in {

      val fixture = new PaypalControllerFixture()(executionContext, context) {
        import scala.collection.JavaConverters._
        val link = new Links("invalidURL", "approval_url")
        val links:java.util.List[Links] = List(link).asJava
        Mockito.when(paymentMock.getLinks).thenReturn(links)
        Mockito.when(paymentMock.getId).thenReturn("paymentID")
        Mockito.when(mockPaypalRequestBasedProvider.getInstanceFor(Matchers.any())(Matchers.any())).thenReturn(mockPaypalBackend)
        Mockito.when(mockPaypalBackend.createPayment(Matchers.any())).thenReturn(result)
      }

      val createPaymentRequest = FakeRequest("POST", "/contribute/one-off/paypal/create-payment").withJsonBody(play.api.libs.json.Json.parse(
        """{
           "currency": "GBP",
           "amount": 1,
           "returnURL": "invalidURL",
           "cancelURL": "http://return-url.com"
           }
        """.stripMargin))

      val paypalControllerResult: Future[play.api.mvc.Result] = Helpers.call(fixture.payPalController.createPayment, createPaymentRequest)
      status(paypalControllerResult).mustBe(500)
    }


  }


}


