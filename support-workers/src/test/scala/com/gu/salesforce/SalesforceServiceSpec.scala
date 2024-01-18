package com.gu.salesforce

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.salesforce.Fixtures.uk
import com.gu.salesforce.Salesforce.{NewContact, SalesforceContactResponse, SalesforceErrorResponse}
import io.circe.Json
import org.mockito.MockitoSugar.{doReturn, spy, when}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._
import io.circe.syntax._
import org.mockito.ArgumentMatchersSugar.any

import scala.concurrent.{ExecutionContext, Future}

class SalesforceServiceSpec extends AnyFlatSpec with Matchers {
  "SalesforceServiceSpec" should "throw appropriately throw an INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE SalesforceErrorResponse" in {
    implicit val executionContext: ExecutionContext = ExecutionContext.global
    val config = mock[SalesforceConfig]
    when(config.url).thenReturn("https://test.salesforce.com")
    val client = mock[FutureHttpClient]
    val service = new SalesforceService(config = config, client = client)
    val errorString =
      "Failed Upsert of new Contact: Upsert failed. First exception on row 0; first error: INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE, Updates can’t be made during maintenance. Try again when maintenance is complete: []"

    val maintenanceResponse = service.parseResponseToResult(
      SalesforceContactResponse(
        Success = false,
        ErrorString = Some(
          errorString,
        ),
        ContactRecord = None,
      ),
    )
    // The joy of untyped Future failures
    maintenanceResponse.leftSide.value.get.failed.get shouldBe SalesforceErrorResponse(
      message = errorString,
      errorCode = "INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE",
    )

    val genericResponse = service.parseResponseToResult(
      SalesforceContactResponse(
        Success = false,
        ErrorString = Some("Things have gone awry"),
        ContactRecord = None,
      ),
    )
    genericResponse.leftSide.value.get.failed.get shouldBe SalesforceErrorResponse(
      message = "Things have gone awry",
      errorCode = "UNKNOWN_ERROR",
    )
  }
}
