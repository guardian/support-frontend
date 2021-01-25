package com.gu.lambdas

import com.gu.model.Stage.CODE
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class UpdateDynamoSpec extends AsyncFlatSpec with Matchers{
  "UpdateDynamoLambda" should "succeed" in {
    UpdateDynamoLambda.writeToDynamo(
      stage = CODE,
      filename = "New Subscriptions-2c92c0867728a2e801772ade71bb56a5"
    ).map(_ =>
      succeed
    )

  }
}
