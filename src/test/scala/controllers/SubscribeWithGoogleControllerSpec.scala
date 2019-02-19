package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend._
import cats.data.EitherT
import cats.implicits._
import model.{DefaultThreadPool, PaymentStatus}
import model.subscribewithgoogle.GoogleRecordPayment
import org.scalatest.mockito.MockitoSugar
import play.api.{ApplicationLoader, BuiltInComponentsFromContext, Configuration, Environment}
import play.api.http.Status
import play.api.inject.DefaultApplicationLifecycle
import play.api.libs.json.Json
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.api.test.{FakeRequest, Helpers}
import play.api.test.Helpers._
import play.core.DefaultWebCommands
import router.Routes
import util.RequestBasedProvider
import io.circe.syntax._
import org.mockito.{Matchers => Match}
import org.mockito.Mockito._
import org.scalatest.{Matchers, WordSpec}
import services.DatabaseService

import scala.concurrent.{ExecutionContext, Future}


class SubscribeWithGoogleControllerFixture()(implicit _ec: ExecutionContext, context: ApplicationLoader.Context)
  extends BuiltInComponentsFromContext(context) with MockitoSugar {

  val ec = implicitly[ExecutionContext]

  val refundGooglePayment = GoogleRecordPayment("Guardian",
    "email@example.com",
    PaymentStatus.Refunded,
    BigDecimal(1.00),
    "GBP",
    "UK",
    "my-super-payment-id",
    System.currentTimeMillis()
  )

  val paidGooglePayment = GoogleRecordPayment("Guardian",
    "email@example.com",
    PaymentStatus.Paid,
    BigDecimal(1.00),
    "GBP",
    "UK",
    "my-super-payment-id",
    System.currentTimeMillis()
  )

  val failedGooglePayment = GoogleRecordPayment("Guardian",
    "email@example.com",
    PaymentStatus.Failed,
    BigDecimal(1.00),
    "GBP",
    "UK",
    "my-super-payment-id",
    System.currentTimeMillis()
  )

  val dbInsertResult: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.right(Future.successful(()))

  val dbInsertError: EitherT[Future, DatabaseService.Error, Unit] =
    EitherT.left(Future.successful(DatabaseService.Error("Didn't update :(", None)))

  val recordPaymentResult: EitherT[Future, BackendError, Unit] =
    EitherT.right(Future.successful(()))

  val recordPaymentError: EitherT[Future, BackendError, Unit] =
    EitherT.left(Future.successful(BackendError.fromDatabaseError(DatabaseService.Error("Didn't update :(", None))))

  val mockSubscribeWithGoogleBackend = mock[SubscribeWithGoogleBackend]

  val subscribeWithGoogleBackendProvider: RequestBasedProvider[SubscribeWithGoogleBackend] =
    mock[RequestBasedProvider[SubscribeWithGoogleBackend]]

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    mock[RequestBasedProvider[StripeBackend]]

  val goCardlessBackendProvider: RequestBasedProvider[GoCardlessBackend] =
    mock[RequestBasedProvider[GoCardlessBackend]]


  val subscribeWithGoogleController = new SubscribeWithGoogleController(controllerComponents,
    subscribeWithGoogleBackendProvider)(DefaultThreadPool(ec), List.empty)

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents)(DefaultThreadPool(ec), List.empty),
    new StripeController(controllerComponents, stripeBackendProvider)(DefaultThreadPool(ec), List.empty),
    new PaypalController(controllerComponents, paypalBackendProvider)(DefaultThreadPool(ec), List.empty),
    new GoCardlessController(controllerComponents, goCardlessBackendProvider)(DefaultThreadPool(ec), List.empty),
    subscribeWithGoogleController
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty

}


class SubscribeWithGoogleControllerSpec extends WordSpec with Matchers with Status with MockitoSugar {

  implicit val actorSystem: ActorSystem = ActorSystem()
  implicit val materializer: Materializer = ActorMaterializer()
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  implicit val context = ApplicationLoader.Context(
    environment = Environment.simple(),
    sourceMapper = None,
    webCommands = new DefaultWebCommands(),
    initialConfiguration = Configuration.load(Environment.simple()),
    lifecycle = new DefaultApplicationLifecycle()
  )


  "Subscribe with Google Controller" must {
    "process a refund" in {
      val fixture = new SubscribeWithGoogleControllerFixture() {
        when(subscribeWithGoogleBackendProvider.getInstanceFor(Match.any())(Match.any()))
          .thenReturn(mockSubscribeWithGoogleBackend)

        when(mockSubscribeWithGoogleBackend.recordRefund(Match.any())).thenReturn(dbInsertResult)
      }

      val json = Json.parse(fixture.refundGooglePayment.asJson.noSpaces)
      val request = FakeRequest("POST", "/contribute/one-off/swg/record-payment")
        .withJsonBody(json)

      val eventualResult: Future[play.api.mvc.Result] =
        Helpers.call(fixture.subscribeWithGoogleController.recordPayment, request)

      status(eventualResult) shouldBe 200

      verify(fixture.mockSubscribeWithGoogleBackend, times(1)).recordRefund(Match.any())
    }

    "process a refund and fail to change db" in {
      val fixture = new SubscribeWithGoogleControllerFixture() {
        when(subscribeWithGoogleBackendProvider.getInstanceFor(Match.any())(Match.any()))
          .thenReturn(mockSubscribeWithGoogleBackend)

        when(mockSubscribeWithGoogleBackend.recordRefund(Match.any())).thenReturn(dbInsertError)
      }

      val json = Json.parse(fixture.refundGooglePayment.asJson.noSpaces)
      val request = FakeRequest("POST", "/contribute/one-off/swg/record-payment")
        .withJsonBody(json)

      val eventualResult: Future[play.api.mvc.Result] =
        Helpers.call(fixture.subscribeWithGoogleController.recordPayment, request)

      status(eventualResult) shouldBe 200

      verify(fixture.mockSubscribeWithGoogleBackend, times(1)).recordRefund(Match.any())
    }

    "process a payment" in {
      val fixture = new SubscribeWithGoogleControllerFixture() {
        when(subscribeWithGoogleBackendProvider.getInstanceFor(Match.any())(Match.any()))
          .thenReturn(mockSubscribeWithGoogleBackend)

        when(mockSubscribeWithGoogleBackend.recordPayment(Match.any(), Match.any(), Match.any()))
          .thenReturn(recordPaymentResult)
      }

      val json = Json.parse(fixture.paidGooglePayment.asJson.noSpaces)
      val request = FakeRequest("POST", "/contribute/one-off/swg/record-payment")
        .withJsonBody(json)

      val eventualResult: Future[play.api.mvc.Result] =
        Helpers.call(fixture.subscribeWithGoogleController.recordPayment, request)

      status(eventualResult) shouldBe 200

      verify(fixture.mockSubscribeWithGoogleBackend, times(1))
        .recordPayment(Match.any(), Match.any(), Match.any())
    }

    "process a payment and fail" in {
      val fixture = new SubscribeWithGoogleControllerFixture() {
        when(subscribeWithGoogleBackendProvider.getInstanceFor(Match.any())(Match.any()))
          .thenReturn(mockSubscribeWithGoogleBackend)

        when(mockSubscribeWithGoogleBackend.recordPayment(Match.any(), Match.any(), Match.any()))
          .thenReturn(recordPaymentError)
      }

      val json = Json.parse(fixture.paidGooglePayment.asJson.noSpaces)
      val request = FakeRequest("POST", "/contribute/one-off/swg/record-payment")
        .withJsonBody(json)

      val eventualResult: Future[play.api.mvc.Result] =
        Helpers.call(fixture.subscribeWithGoogleController.recordPayment, request)

      status(eventualResult) shouldBe 200

      verify(fixture.mockSubscribeWithGoogleBackend, times(1))
        .recordPayment(Match.any(), Match.any(), Match.any())
    }

    "receive a payment fail and do nothing" in {
      val fixture = new SubscribeWithGoogleControllerFixture() {
        when(subscribeWithGoogleBackendProvider.getInstanceFor(Match.any())(Match.any()))
          .thenReturn(mockSubscribeWithGoogleBackend)

        when(mockSubscribeWithGoogleBackend.recordPayment(Match.any(), Match.any(), Match.any()))
          .thenReturn(recordPaymentError)
        when(mockSubscribeWithGoogleBackend.recordRefund(Match.any())).thenReturn(dbInsertResult)
      }

      val json = Json.parse(fixture.failedGooglePayment.asJson.noSpaces)
      val request = FakeRequest("POST", "/contribute/one-off/swg/record-payment")
        .withJsonBody(json)

      val eventualResult: Future[play.api.mvc.Result] =
        Helpers.call(fixture.subscribeWithGoogleController.recordPayment, request)

      status(eventualResult) shouldBe 200

      verify(fixture.mockSubscribeWithGoogleBackend, times(0))
        .recordPayment(Match.any(), Match.any(), Match.any())
      verify(fixture.mockSubscribeWithGoogleBackend, times(0)).recordRefund(Match.any())

    }
  }
}
