package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend.{GoCardlessBackend, PaypalBackend, StripeBackend}
import cats.data.EitherT
import com.gocardless.errors.GoCardlessApiException
import model.DefaultThreadPool
import model.directdebit.CheckDirectDebitDetailsResponse
import org.mockito.Mockito._
import org.mockito.ArgumentMatchers.any
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
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
import services.CloudWatchService
import util.RequestBasedProvider

import scala.concurrent.{ExecutionContext, Future}

class GoCardlessControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context)
    extends BuiltInComponentsFromContext(context)
    with MockitoSugar {

  val goCardlessValidResponse: EitherT[Future, Throwable, CheckDirectDebitDetailsResponse] =
    EitherT.rightT[Future, Throwable](CheckDirectDebitDetailsResponse(true))

  val goCardlessInvalidResponse: EitherT[Future, Throwable, CheckDirectDebitDetailsResponse] =
    EitherT.rightT[Future, Throwable](CheckDirectDebitDetailsResponse(false))

  val mockGoCardlessApiException: GoCardlessApiException =
    mock[GoCardlessApiException]

  val goCardlessGoCardlessApiExceptionResponse: EitherT[Future, Throwable, CheckDirectDebitDetailsResponse] =
    EitherT.leftT[Future, CheckDirectDebitDetailsResponse](mockGoCardlessApiException)

  val goCardlessOtherExceptionResponse: EitherT[Future, Throwable, CheckDirectDebitDetailsResponse] =
    EitherT.leftT[Future, CheckDirectDebitDetailsResponse](new Exception())

  val mockGoCardlessBackend: GoCardlessBackend =
    mock[GoCardlessBackend]

  val mockGoCardlessRequestBasedProvider: RequestBasedProvider[GoCardlessBackend] =
    mock[RequestBasedProvider[GoCardlessBackend]]

  val goCardlessController: GoCardlessController =
    new GoCardlessController(controllerComponents, mockGoCardlessRequestBasedProvider)(
      DefaultThreadPool(ec),
      List("https://cors.com"),
    )

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    mock[RequestBasedProvider[StripeBackend]]

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  val mockAmazonPayController: AmazonPayController = mock[AmazonPayController]

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents)(DefaultThreadPool(ec), List.empty),
    new StripeController(controllerComponents, stripeBackendProvider, mockCloudWatchService)(
      DefaultThreadPool(ec),
      List.empty,
    ),
    new PaypalController(controllerComponents, paypalBackendProvider)(DefaultThreadPool(ec), List.empty),
    goCardlessController,
    mockAmazonPayController,
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class GoCardlessControllerSpec extends AnyWordSpec with Status with Matchers {

  implicit val actorSystem = ActorSystem("rest-server")
  implicit val materializer: Materializer = ActorMaterializer()
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val context = ApplicationLoader.Context.create(Environment.simple())

  "GoCardless Controller" when {

    "a request is made to validate some valid bank details" should {

      val fixtureForValidResponse = new GoCardlessControllerFixture()(executionContext, context) {
        when(mockGoCardlessRequestBasedProvider.getInstanceFor(any())(any()))
          .thenReturn(mockGoCardlessBackend)
        when(mockGoCardlessBackend.checkBankAccount(any()))
          .thenReturn(goCardlessValidResponse)
      }

      "return a 200 response if the account details are valid with accountValid:true in the payload" in {
        val checkAccountRequest = FakeRequest("POST", "/direct-debit/check-account")
          .withJsonBody(parse("""
              |{
              |  "accountNumber": "55779911",
              |  "sortCode": "200000"
              |}
            """.stripMargin))

        val goCardlessControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixtureForValidResponse.goCardlessController.checkBankAccount, checkAccountRequest)

        status(goCardlessControllerResult).mustBe(200)
        contentAsString(goCardlessControllerResult).mustBe(
          """{"data":{"accountValid":true,"goCardlessStatusCode":null},"type":"success"}""",
        )
      }

    }

    "a request is made to validate some invalid bank details" should {

      val fixtureForInvalidResponse = new GoCardlessControllerFixture()(executionContext, context) {
        when(mockGoCardlessRequestBasedProvider.getInstanceFor(any())(any()))
          .thenReturn(mockGoCardlessBackend)
        when(mockGoCardlessBackend.checkBankAccount(any()))
          .thenReturn(goCardlessInvalidResponse)
      }

      "return a 200 response if the account details are invalid with accountValid:false in the payload" in {
        val checkAccountRequest = FakeRequest("POST", "/direct-debit/check-account")
          .withJsonBody(parse("""
              |{
              |  "accountNumber": "12345678",
              |  "sortCode": "123456"
              |}
            """.stripMargin))

        val goCardlessControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixtureForInvalidResponse.goCardlessController.checkBankAccount, checkAccountRequest)

        status(goCardlessControllerResult).mustBe(200)
        contentAsString(goCardlessControllerResult).mustBe(
          """{"data":{"accountValid":false,"goCardlessStatusCode":null},"type":"success"}""",
        )
      }

    }

    "a request is made to validate some incomplete bank details" should {

      val fixtureForInvalidResponse = new GoCardlessControllerFixture()(executionContext, context) {
        when(mockGoCardlessRequestBasedProvider.getInstanceFor(any())(any()))
          .thenReturn(mockGoCardlessBackend)
        when(mockGoCardlessApiException.getCode)
          .thenReturn(123)
        when(mockGoCardlessBackend.checkBankAccount(any()))
          .thenReturn(goCardlessGoCardlessApiExceptionResponse)
      }

      "return a 200 response if the account details are incomplete with accountValid:false and the GoCardless status code in the payload" in {
        val checkAccountRequest = FakeRequest("POST", "/direct-debit/check-account")
          .withJsonBody(parse("""
              |{
              |  "accountNumber": "123",
              |  "sortCode": "123"
              |}
            """.stripMargin))

        val goCardlessControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixtureForInvalidResponse.goCardlessController.checkBankAccount, checkAccountRequest)

        status(goCardlessControllerResult).mustBe(200)
        contentAsString(goCardlessControllerResult).mustBe(
          """{"data":{"accountValid":false,"goCardlessStatusCode":123},"type":"success"}""",
        )
      }

    }

    "a request is made to validate some bank details and something blows up" should {

      val fixtureForExplodedResponse = new GoCardlessControllerFixture()(executionContext, context) {
        when(mockGoCardlessRequestBasedProvider.getInstanceFor(any())(any()))
          .thenReturn(mockGoCardlessBackend)
        when(mockGoCardlessBackend.checkBankAccount(any()))
          .thenReturn(goCardlessOtherExceptionResponse)
      }

      "return a 500 response if something blows up when validating" in {
        val checkAccountRequest = FakeRequest("POST", "/direct-debit/check-account")
          .withJsonBody(parse("""
              |{
              |  "accountNumber": "123",
              |  "sortCode": "123"
              |}
            """.stripMargin))

        val goCardlessControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixtureForExplodedResponse.goCardlessController.checkBankAccount, checkAccountRequest)

        status(goCardlessControllerResult).mustBe(500)
      }

    }

  }

}
