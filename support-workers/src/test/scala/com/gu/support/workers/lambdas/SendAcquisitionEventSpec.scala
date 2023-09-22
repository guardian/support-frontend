package com.gu.support.workers.lambdas

import cats.data.EitherT
import com.gu.config.Configuration
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.acquisitions.AcquisitionsStreamService
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.config.Stages.CODE
import com.gu.support.workers.JsonFixtures.{sendAcquisitionEventGWJson, sendAcquisitionEventPrintJson, wrapFixture}
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}
import com.gu.test.tags.objects.IntegrationTest
import org.mockito.ArgumentMatchers._
import org.mockito.Mockito.when
import org.scalatestplus.mockito.MockitoSugar

import java.io.ByteArrayOutputStream
import scala.concurrent.Future

class SendAcquisitionEventSpec extends AsyncLambdaSpec with MockContext {

  "SendAcquisitionEvent" should "work with print input" taggedAs IntegrationTest in {
    sendEvent(sendAcquisitionEventPrintJson)
  }

  "SendAcquisitionEvent" should "work with GW 6 for 6 input" taggedAs IntegrationTest in {
    sendEvent(sendAcquisitionEventGWJson)
  }

  private def sendEvent(json: String) = {
    val sendAcquisitionEvent = new SendAcquisitionEvent(MockAcquisitionHelper.mockServices)

    val outStream = new ByteArrayOutputStream()

    sendAcquisitionEvent.handleRequestFuture(wrapFixture(json), outStream, context).map { _ =>
      // Check the output
      val out = Encoding.in[Unit](outStream.toInputStream)

      out.isSuccess should be(true)
    }
  }

}

object MockAcquisitionHelper extends MockitoSugar {

  val mockAcquisitionsStreamService = new AcquisitionsStreamService {
    def putAcquisition(acquisition: AcquisitionDataRow): EitherT[Future, String, Unit] =
      EitherT(
        Future.successful(
          Right(()): Either[String, Unit],
        ),
      )
  }

  lazy val mockServices = {
    val configuration = Configuration.load()
    // Mock the Acquisition service
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val eventBridgeService = AcquisitionsEventBusService("Integration Test", CODE, false)

    when(services.acquisitionsEventBusService).thenReturn(eventBridgeService)
    when(services.acquisitionsStreamService).thenReturn(mockAcquisitionsStreamService)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

}
