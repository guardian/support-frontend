package com.gu.support.workers.lambdas

import com.gu.acquisitions.AcquisitionServiceBuilder
import com.gu.config.Configuration
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.JsonFixtures.{sendAcquisitionEventJson, sendAcquisitionEventPrintJson, wrapFixture}
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}
import com.gu.test.tags.objects.IntegrationTest
import org.mockito.ArgumentMatchers._

import java.io.ByteArrayOutputStream

class SendOldAcquisitionEventSpec extends AsyncLambdaSpec with MockContext {

  lazy val mockServices = {
    val configuration = Configuration.load()
    //Mock the Acquisition service
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val acquisitionService = AcquisitionServiceBuilder.build(configuration.kinesisStreamName, isTestService = true)

    when(services.acquisitionService).thenReturn(acquisitionService)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

  "SendOldAcquisitionEvent" should "work with a valid input" taggedAs IntegrationTest in {
    val sendAcquisitionEvent = new SendOldAcquisitionEvent(mockServices)

    val outStream = new ByteArrayOutputStream()

    sendAcquisitionEvent.handleRequestFuture(wrapFixture(sendAcquisitionEventJson), outStream, context).map { _ =>

      //Check the output
      val out = Encoding.in[Unit](outStream.toInputStream)

      out.isSuccess should be(true)
    }
  }

}
