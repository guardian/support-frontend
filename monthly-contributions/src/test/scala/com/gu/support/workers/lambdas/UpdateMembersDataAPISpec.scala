package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.membersDataAPI.{MembersDataService, UpdateResponse}
import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.Fixtures.updateMembersDataAPIJson
import org.scalatest.mockito.MockitoSugar
import org.mockito.Mockito.{times, when, verify}
import org.mockito.Matchers.{eq => argEq}
import com.gu.salesforce.Fixtures.idId
import scala.concurrent.Future

class UpdateMembersDataAPISpec extends LambdaSpec with MockitoSugar {

  "UpdateMembersDataAPI lambda" should "create put request to Members Data API" in {
    val membersDataService = mock[MembersDataService]

    when(membersDataService.update(argEq(idId)))
      .thenReturn(Future.successful(UpdateResponse(true)))

    val updateMembersDataAPI = new UpdateMembersDataAPI(membersDataService)

    val outStream = new ByteArrayOutputStream()

    updateMembersDataAPI.handleRequest(updateMembersDataAPIJson.asInputStream(), outStream, context)

    outStream.toClass[Unit]() shouldEqual ((): Unit)

    verify(membersDataService, times(1)).update(argEq(idId))
  }
}

