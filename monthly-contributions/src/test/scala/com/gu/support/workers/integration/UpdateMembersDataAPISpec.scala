package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.Fixtures.updateMembersDataAPIJson
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.lambdas.UpdateMembersDataAPI
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class UpdateMembersDataAPISpec extends LambdaSpec {

  "UpdateMembersDataAPI lambda" should "make post request to members data api" in {
    val updateMembersDataAPI = new UpdateMembersDataAPI()

    val outStream = new ByteArrayOutputStream()

    updateMembersDataAPI.handleRequest(updateMembersDataAPIJson.asInputStream(), outStream, context)

    outStream.toClass[Unit]() shouldEqual ((): Unit)
  }
}
