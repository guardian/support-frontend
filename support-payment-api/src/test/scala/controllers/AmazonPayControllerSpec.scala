package controllers

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import backend._
import cats.data.EitherT
import cats.instances.all._
import com.amazon.pay.response.ipn.model.Notification
import model.DefaultThreadPool
import model.amazonpay.AmazonPayApiError
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

class AmazonPayControllerFixture(implicit ec: ExecutionContext, context: ApplicationLoader.Context)
    extends BuiltInComponentsFromContext(context)
    with MockitoSugar {

  val mockAmazonPayBackend: AmazonPayBackend = mock[AmazonPayBackend]

  val mockNotificationFactory = mock[(Map[String, String], String) => Notification]

  val mockAmazonPayRequestBasedProvider: RequestBasedProvider[AmazonPayBackend] =
    mock[RequestBasedProvider[AmazonPayBackend]]

  val amazonPayResponse: EitherT[Future, AmazonPayApiError, Unit] =
    EitherT.right(Future(())).leftMap { x: String => AmazonPayApiError.fromString("went wrong") }

  val refundSuccess: EitherT[Future, Throwable, Unit] =
    EitherT.right(Future.successful(()))

  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  val amazonPayController: AmazonPayController =
    new AmazonPayController(controllerComponents, mockAmazonPayRequestBasedProvider, mockNotificationFactory)(
      DefaultThreadPool(ec),
      List("https://cors.com"),
    )

  val refundError: EitherT[Future, Throwable, Unit] =
    EitherT.left[Unit](
      Future.successful[Throwable](BackendError.AmazonPayApiError(AmazonPayApiError.fromString("Error response"))),
    )

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    mock[RequestBasedProvider[PaypalBackend]]

  val goCardlessBackendProvider: RequestBasedProvider[GoCardlessBackend] =
    mock[RequestBasedProvider[GoCardlessBackend]]

  val mockStripeController = mock[StripeController]

  override def router: Router = new Routes(
    httpErrorHandler,
    new AppController(controllerComponents)(DefaultThreadPool(ec), List.empty),
    mockStripeController,
    new PaypalController(controllerComponents, paypalBackendProvider)(DefaultThreadPool(ec), List.empty),
    new GoCardlessController(controllerComponents, goCardlessBackendProvider)(DefaultThreadPool(ec), List.empty),
    amazonPayController,
  )

  override def httpFilters: Seq[EssentialFilter] = Seq.empty
}

class AmazonPayControllerSpec extends AnyWordSpec with Status with Matchers {

  implicit val actorSystem = ActorSystem("rest-server")
  implicit val materializer: Materializer = ActorMaterializer()
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val context = ApplicationLoader.Context.create(Environment.simple())

  "AmazonPayController" when {

    "a request is made to create a payment" should {

      "return a 200 response if the request is valid and sent using the new format - full request" in {
        val fixture = new AmazonPayControllerFixture()(executionContext, context) {
          when(mockAmazonPayBackend.makePayment(any(), any()))
            .thenReturn(amazonPayResponse)
          when(mockAmazonPayRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockAmazonPayBackend)
        }
        val createAmazonPayRequest = FakeRequest("POST", "/contribute/one-off/amazonpay/create-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1,
              |    "orderReferenceId": "jducx5kjl3u7cwf5ocudjducx5kjl3u7cwf5ocud",
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
              |         "variant":"a-amazonpay"
              |       },
              |       {
              |         "name":"b-checkout",
              |         "variant":"b-amazonpay"
              |       }
              |     ]
              |  }
              |}
                  """.stripMargin))

        val amazonpayControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.amazonPayController.executePayment, createAmazonPayRequest)

        status(amazonpayControllerResult).mustBe(200)
      }

      "return a 200 response if the request is valid and the amount contains a decimal point - full request" in {
        val fixture = new AmazonPayControllerFixture()(executionContext, context) {
          when(mockAmazonPayBackend.makePayment(any(), any()))
            .thenReturn(amazonPayResponse)
          when(mockAmazonPayRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockAmazonPayBackend)
        }
        val createAmazonPayRequest = FakeRequest("POST", "/contribute/one-off/amazonpay/create-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1.23,
              |    "orderReferenceId": "jducx5kjl3u7cwf5ocudjducx5kjl3u7cwf5ocud",
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
              |         "variant":"a-amazonpay"
              |       },
              |       {
              |         "name":"b-checkout",
              |         "variant":"b-amazonpay"
              |       }
              |     ]
              |  }
              |}
                  """.stripMargin))

        val amazonpayControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.amazonPayController.executePayment, createAmazonPayRequest)

        status(amazonpayControllerResult).mustBe(200)
      }

      "return cors headers if origin matches existing config definition" in {
        val fixture = new AmazonPayControllerFixture()(executionContext, context) {
          when(mockAmazonPayBackend.makePayment(any(), any()))
            .thenReturn(amazonPayResponse)
          when(mockAmazonPayRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockAmazonPayBackend)
        }
        val createAmazonPayRequest = FakeRequest("POST", "/contribute/one-off/amazonpay/create-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1.23,
              |    "orderReferenceId": "jducx5kjl3u7cwf5ocudjducx5kjl3u7cwf5ocud",
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
              |         "variant":"a-amazonpay"
              |       },
              |       {
              |         "name":"b-checkout",
              |         "variant":"b-amazonpay"
              |       }
              |     ]
              |  },
              |  "publicKey": "pk_test_FOO"
              |}
                  """.stripMargin))
          .withHeaders("origin" -> "https://cors.com")

        val amazonpayControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.amazonPayController.executePayment, createAmazonPayRequest)

        val headerResponse = headers(amazonpayControllerResult)
        headerResponse.get("Access-Control-Allow-Origin").mustBe(Some("https://cors.com"))
        headerResponse.get("Access-Control-Allow-Headers").mustBe(Some("Origin, Content-Type, Accept"))
        headerResponse.get("Access-Control-Allow-Credentials").mustBe(Some("true"))
      }

      "return a 400 response if the request contains an invalid JSON" in {
        val fixture = new AmazonPayControllerFixture()(executionContext, context) {
          when(mockAmazonPayBackend.makePayment(any(), any()))
            .thenReturn(amazonPayResponse)
          when(mockAmazonPayRequestBasedProvider.getInstanceFor(any())(any()))
            .thenReturn(mockAmazonPayBackend)
        }
        val createAmazonPayRequest = FakeRequest("POST", "/contribute/one-off/amazonpay/create-payment")
          .withJsonBody(parse("""
              |{
              |  "paymentData": {
              |    "currency": "GBP",
              |    "amount": 1,
              |    "email": "email@theguardian.com"
              |  }
              |}
                  """.stripMargin))

        val amazonpayControllerResult: Future[play.api.mvc.Result] =
          Helpers.call(fixture.amazonPayController.executePayment, createAmazonPayRequest)

        status(amazonpayControllerResult).mustBe(400)
      }

      "a request is made to refund a payment" should {

        "return a 204 response if the request is valid" in {

          val jsonBody =
            """{
              |    "Type" : "Notification",
              |    "MessageId" : "1c53034e-051f-5fe2-a4e7-4d17c21104eb",
              |    "TopicArn" : "arn:aws:sns:us-east-1:291180941288:A3BXB0YN3XH17HA2K7NDRCTOTPW9",
              |    "Message" : "{\"MarketplaceID\":\"A3BXB0YN3XH17H\",\"ReleaseEnvironment\":\"Sandbox\",\"Version\":\"2013-01-01\",\"NotificationType\":\"PaymentRefund\",\"SellerId\":\"A2K7NDRCTOTPW9\",\"NotificationReferenceId\":\"1111111-1111-11111-1111-11111EXAMPLE\",\"IsSample\":true,\"Timestamp\":\"2015-08-28T02:17:50.683Z\",\"NotificationData\":\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n        <RefundNotification xmlns=\\\"https://mws.amazonservices.com/ipn/OffAmazonPayments/2013-01-01\\\">\\n            <RefundDetails>\\n                <AmazonRefundId>P01-0000000-0000000-000000<\\/AmazonRefundId>\\n                <RefundReferenceId>P01-0000000-0000000-Ref<\\/RefundReferenceId>\\n                <RefundType>SellerInitiated<\\/RefundType>\\n                <RefundAmount>\\n                    <Amount>3.0<\\/Amount>\\n                    <CurrencyCode>USD<\\/CurrencyCode>\\n                <\\/RefundAmount>\\n                <FeeRefunded>\\n                    <Amount>2.0<\\/Amount>\\n                    <CurrencyCode>USD<\\/CurrencyCode>\\n                <\\/FeeRefunded>\\n                <CreationTimestamp>2013-01-01T01:01:01.001Z<\\/CreationTimestamp>\\n                <RefundStatus>\\n                    <State>Completed<\\/State>    \\n                    <LastUpdateTimestamp>2013-01-01T01:01:01.001Z<\\/LastUpdateTimestamp>\\n                        <ReasonCode>None<\\/ReasonCode>                    \\n                <\\/RefundStatus>\\n                <SoftDescriptor>AMZ*softDescriptor<\\/SoftDescriptor>\\n            <\\/RefundDetails>\\n        <\\/RefundNotification>\"}",
              |    "Timestamp" : "2015-08-28T02:17:50.722Z",
              |    "SignatureVersion" : "1",
              |    "Signature" : "gY8bJ8JWxw1jW28Pg3U9CDheqfPYSAYHpLPKyVZwNoc3epJ0YUvAyqs+QKslPAmRm2Dgeb5acDWgEGU+WulcWyK1s7s5uz+Ngr12zyWaZLbvtOuEoimTYZQHsWQNsjtTyjv+Huj4Lm81QOlJs3DSX19N9SMYSiLbhODVo6N+bkuELZBoT5QSx+y9+tb/AEK2zKdbwFwXcCKZryu+igj69hiyDSyKYRRFDs7Zxert7EWGWIQaJBanHV3vggs+sIAUDz7RrAgmJwQ2ktrH89/BQk4GGDT5Z9d6Xu7Mt7VCWkv1E3PU4C5dg7wSVD4+WAt523436llHrNVgD7N39cKl9g==",
              |    "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-bb750dd426d95ee9390147a5624348ee.pem",
              |    "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:291180941288:A3BXB0YN3XH17HA2K7NDRCTOTPW9:05542723-375e-4609-98f1-8abcf427d95f"
              |}""".stripMargin

          val fixture = new AmazonPayControllerFixture()(executionContext, context) {
            when(mockAmazonPayBackend.handleNotification(any()))
              .thenReturn(refundSuccess)
            when(mockAmazonPayRequestBasedProvider.getInstanceFor(any())(any()))
              .thenReturn(mockAmazonPayBackend)
          }

          val amazonpayRefundRequest = FakeRequest("POST", "/")
            .withJsonBody(parse(jsonBody))
            .withHeaders("x-amz-sns-message-type" -> "Notification", "Content-Type" -> "text/plain")

          val amazonpayControllerResult: Future[play.api.mvc.Result] =
            Helpers.call(fixture.amazonPayController.notification(), amazonpayRefundRequest)

          status(amazonpayControllerResult).mustBe(204)

        }

        "return a 503 response if we fail processing the request" in {

          val jsonBody =
            """{
              |    "Type" : "Notification",
              |    "MessageId" : "1c53034e-051f-5fe2-a4e7-4d17c21104eb",
              |    "TopicArn" : "arn:aws:sns:us-east-1:291180941288:A3BXB0YN3XH17HA2K7NDRCTOTPW9",
              |    "Message" : "{\"MarketplaceID\":\"A3BXB0YN3XH17H\",\"ReleaseEnvironment\":\"Sandbox\",\"Version\":\"2013-01-01\",\"NotificationType\":\"PaymentRefund\",\"SellerId\":\"A2K7NDRCTOTPW9\",\"NotificationReferenceId\":\"1111111-1111-11111-1111-11111EXAMPLE\",\"IsSample\":true,\"Timestamp\":\"2015-08-28T02:17:50.683Z\",\"NotificationData\":\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n        <RefundNotification xmlns=\\\"https://mws.amazonservices.com/ipn/OffAmazonPayments/2013-01-01\\\">\\n            <RefundDetails>\\n                <AmazonRefundId>P01-0000000-0000000-000000<\\/AmazonRefundId>\\n                <RefundReferenceId>P01-0000000-0000000-Ref<\\/RefundReferenceId>\\n                <RefundType>SellerInitiated<\\/RefundType>\\n                <RefundAmount>\\n                    <Amount>3.0<\\/Amount>\\n                    <CurrencyCode>USD<\\/CurrencyCode>\\n                <\\/RefundAmount>\\n                <FeeRefunded>\\n                    <Amount>2.0<\\/Amount>\\n                    <CurrencyCode>USD<\\/CurrencyCode>\\n                <\\/FeeRefunded>\\n                <CreationTimestamp>2013-01-01T01:01:01.001Z<\\/CreationTimestamp>\\n                <RefundStatus>\\n                    <State>Completed<\\/State>    \\n                    <LastUpdateTimestamp>2013-01-01T01:01:01.001Z<\\/LastUpdateTimestamp>\\n                        <ReasonCode>None<\\/ReasonCode>                    \\n                <\\/RefundStatus>\\n                <SoftDescriptor>AMZ*softDescriptor<\\/SoftDescriptor>\\n            <\\/RefundDetails>\\n        <\\/RefundNotification>\"}",
              |    "Timestamp" : "2015-08-28T02:17:50.722Z",
              |    "SignatureVersion" : "1",
              |    "Signature" : "gY8bJ8JWxw1jW28Pg3U9CDheqfPYSAYHpLPKyVZwNoc3epJ0YUvAyqs+QKslPAmRm2Dgeb5acDWgEGU+WulcWyK1s7s5uz+Ngr12zyWaZLbvtOuEoimTYZQHsWQNsjtTyjv+Huj4Lm81QOlJs3DSX19N9SMYSiLbhODVo6N+bkuELZBoT5QSx+y9+tb/AEK2zKdbwFwXcCKZryu+igj69hiyDSyKYRRFDs7Zxert7EWGWIQaJBanHV3vggs+sIAUDz7RrAgmJwQ2ktrH89/BQk4GGDT5Z9d6Xu7Mt7VCWkv1E3PU4C5dg7wSVD4+WAt523436llHrNVgD7N39cKl9g==",
              |    "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-bb750dd426d95ee9390147a5624348ee.pem",
              |    "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:291180941288:A3BXB0YN3XH17HA2K7NDRCTOTPW9:05542723-375e-4609-98f1-8abcf427d95f"
              |}""".stripMargin

          val fixture = new AmazonPayControllerFixture()(executionContext, context) {
            when(mockAmazonPayBackend.handleNotification(any()))
              .thenReturn(refundError)
            when(mockAmazonPayRequestBasedProvider.getInstanceFor(any())(any()))
              .thenReturn(mockAmazonPayBackend)
          }

          val amazonpayRefundRequest = FakeRequest("POST", "/")
            .withJsonBody(parse(jsonBody))
            .withHeaders("x-amz-sns-message-type" -> "Notification")

          val amazonpayControllerResult: Future[play.api.mvc.Result] =
            Helpers.call(fixture.amazonPayController.notification(), amazonpayRefundRequest)

          status(amazonpayControllerResult).mustBe(503)

        }
      }
    }
  }
}
