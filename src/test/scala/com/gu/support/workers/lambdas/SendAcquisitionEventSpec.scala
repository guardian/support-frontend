package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.ophan.OphanService
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.Fixtures.sendAcquisitionEventJson
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}
import com.gu.test.tags.objects.IntegrationTest
import org.mockito.Matchers._
import org.mockito.Mockito.when
import org.scalatest.mockito.MockitoSugar

class SendAcquisitionEventSpec extends AsyncLambdaSpec with MockContext {

  "SendAcquisitionEvent" should "work with a valid input" taggedAs IntegrationTest in {
    val sendAcquisitionEvent = new SendAcquisitionEvent(MockOphanHelper.mockServices)

    val outStream = new ByteArrayOutputStream()

    sendAcquisitionEvent.handleRequest(sendAcquisitionEventJson.asInputStream, outStream, context)
    //Check the output

    val out = Encoding.in[Unit](outStream.toInputStream)

    out.isSuccess should be(true)
  }

}

object MockOphanHelper extends MockitoSugar {

  lazy val mockServices = {
    //Mock the Ophan service
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val ophan = OphanService(true)

    when(services.ophanService).thenReturn(ophan)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

}
