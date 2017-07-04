package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Fixtures.{updateMembersDataAPIJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.lambdas.UpdateMembersDataAPI
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class UpdateMembersDataAPISpec extends LambdaSpec {

  //"UpdateMembersDataAPI lambda" Ignored because we don't currently have a code environment for members data api
  ignore should "make post request to members data api" in {
    val updateMembersDataAPI = new UpdateMembersDataAPI()

    val outStream = new ByteArrayOutputStream()

    updateMembersDataAPI.handleRequest(wrapFixture(updateMembersDataAPIJson), outStream, context)

    assertUnit(outStream)
  }
}
