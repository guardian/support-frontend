package com.gu.model.zuora.response

import com.gu.model.zuora.response.JobStatus.Completed
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SerialisationSpec extends AnyFlatSpec with Matchers {

  "BatchQueryResponse" should "serialise successfully" in {
    val json =
      """
         {
         "status": "completed",
         "batches": [
             {
                 "localizedStatus": "completed",
                 "status": "completed",
                 "recordCount": 220,
                 "fileId": "2c92c086770917c40177167e4418436c",
                 "batchId": "2c92c0f977091c5c0177167d05fe7d7f",
                 "apiVersion": "107.0",
                 "batchType": "zoqlexport",
                 "full": true,
                 "name": "AttributesQuery",
                 "message": "",
                 "query": "SELECT Account.IdentityId__c, RatePlan.Name, Subscription.TermEndDate FROM rateplan WHERE Subscription.Status = 'Active' AND Subscription.TermEndDate >= '2021-01-01'"
             }
         ],
         "encrypted": "none",
         "useLastCompletedJobQueries": false,
         "startTime": "2021-01-18T17:13:48+0000",
         "version": "1.0",
         "format": "CSV",
         "name": "Fulfilment-Queries",
         "id": "2c92c0f977091c5c0177167d05f77d7c",
         "offset": 0
     }
         """
    val result = decode[BatchQueryResponse](json)
    result should matchPattern {
      case Right(
            BatchQueryResponse(
              "2c92c0f977091c5c0177167d05f77d7c",
              Completed,
              List(
                BatchQueryItem("AttributesQuery", Some("2c92c086770917c40177167e4418436c"), 220, true),
              ),
            ),
          ) =>
    }
  }
}
