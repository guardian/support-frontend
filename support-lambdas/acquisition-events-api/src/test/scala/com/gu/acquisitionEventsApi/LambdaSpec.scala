package com.gu.acquisitionEventsApi

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent.ProxyRequestContext
import com.gu.i18n.{Country, OtherCurrency}
import com.gu.support.acquisitions.QueryParameter
import com.gu.support.acquisitions.models._
import com.gu.support.zuora.api.ReaderType
import io.circe.syntax._
import org.joda.time.DateTime
import org.scalatest.Ignore
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

@Ignore
class LambdaSpec extends AnyFlatSpec with Matchers {
  val acquisition = AcquisitionDataRow(
    eventTimeStamp = new DateTime(1544710504165L),
    product = AcquisitionProduct.RecurringContribution,
    amount = Some(1.0),
    country = Country.UK,
    currency = OtherCurrency("BHD", "ب.د"),
    componentId = Some("MY_COMPONENT_ID"),
    componentType = None,
    campaignCode = Some("MY_CAMPAIGN_CODE"),
    source = None,
    referrerUrl = Some("referrer-url"),
    abTests = Nil,
    paymentFrequency = PaymentFrequency.Monthly,
    paymentProvider = Some(PaymentProvider.Stripe),
    printOptions = None,
    browserId = None,
    identityId = None,
    pageViewId = None,
    referrerPageViewId = None,
    labels = Nil,
    promoCode = None,
    reusedExistingPaymentMethod = false,
    readerType = ReaderType.Direct,
    acquisitionType = AcquisitionType.Purchase,
    zuoraSubscriptionNumber = None,
    zuoraAccountNumber = None,
    contributionId = None,
    paymentId = None,
    queryParameters = List(QueryParameter("name1", "value1"), QueryParameter("name2", "value2")),
    platform = None,
  )
  // Create a new instance of ProxyRequestContext
  val requestContext = new ProxyRequestContext()
    .withAccountId("my-account-id")
    .withStage("dev")
    .withResourceId("my-resource-id")
    .withRequestId("my-request-id")
    .withHttpMethod("GET")
    .withApiId("my-api-id")
    .withPath("/my-resource-path")

  // Set the authorizer map
  val authorizer = None

  // Set the RequestIdentity
  val identity = None

  it should "run locally" in {
    val request = new APIGatewayProxyRequestEvent()
    request.setBody(acquisition.asJson.noSpaces)
    request.setRequestContext(
      requestContext,
    ) // Updated as added request ID to acquisition-events-api logs and so in processEvent function in Lambda.scala
    val result = Lambda.handler(request)
    result.getStatusCode should be(200)
  }
}
