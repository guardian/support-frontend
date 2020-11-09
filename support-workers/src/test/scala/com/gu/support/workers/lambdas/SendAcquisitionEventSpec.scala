package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.acquisitions.AcquisitionServiceBuilder
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.JsonFixtures.{sendAcquisitionEventJson, wrapFixture}
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}
import com.gu.test.tags.objects.IntegrationTest
import org.mockito.ArgumentMatchers._
import org.mockito.Mockito.when
import org.scalatestplus.mockito.MockitoSugar
import cats.implicits._
import com.gu.config.Configuration

import scala.concurrent.Future

class SendAcquisitionEventSpec extends AsyncLambdaSpec with MockContext {

  "SendAcquisitionEvent" should "work with a valid input" taggedAs IntegrationTest in {
    val sendAcquisitionEvent = new SendAcquisitionEvent(MockAcquisitionHelper.mockServices)

    val outStream = new ByteArrayOutputStream()

    sendAcquisitionEvent.handleRequestFuture(wrapFixture(sendAcquisitionEventJson), outStream, context).map { _ =>

      //Check the output
      val out = Encoding.in[Unit](outStream.toInputStream)

      out.isSuccess should be(true)
    }
  }

}

object MockAcquisitionHelper extends MockitoSugar {

  lazy val mockServices = {
    //Mock the Acquisition service
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val acquisitionService = AcquisitionServiceBuilder.build(Configuration.load().kinesisStreamName, isTestService = true)

    when(services.acquisitionService).thenReturn(acquisitionService)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

}
