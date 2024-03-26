package com.gu.support.acquisitions.eventbridge

import com.amazonaws.regions.Regions
import com.amazonaws.services.eventbridge.model.{PutEventsRequest, PutEventsRequestEntry}
import com.amazonaws.services.eventbridge.{AmazonEventBridge, AmazonEventBridgeClient}
import com.gu.aws.CredentialsProviderDEPRECATEDV1
import com.gu.monitoring.SafeLogging
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.config.Stage
import com.gu.support.config.Stages.CODE
import io.circe.syntax.EncoderOps
import software.amazon.awssdk.core.exception.SdkException

import java.time.Instant
import java.util.Date
import scala.concurrent.Promise
import scala.jdk.CollectionConverters.SeqHasAsJava

class AcquisitionsEventBusService(source: String, stage: Stage, client: AmazonEventBridge) extends SafeLogging {
  val eventBusName = s"acquisitions-bus-${stage.toString}"
  val detailType = "AcquisitionsEvent"
  def putAcquisitionEvent(acquisition: AcquisitionDataRow) = {
    val acquisitionJson = acquisition.asJson
    logger.info(s"Attempting to send event ${acquisitionJson.spaces2}")
    val entry = new PutEventsRequestEntry
    entry.setEventBusName(eventBusName)
    entry.setSource(source)
    entry.setDetailType(detailType)
    entry.setDetail(acquisitionJson.noSpaces)
    entry.setTime(Date.from(Instant.now))

    val putEventsRequest = new PutEventsRequest
    putEventsRequest.setEntries(List(entry).asJava)

    val promise = Promise[Either[String, Unit]]
    try {
      val result = client.putEvents(putEventsRequest)
      if (result.getFailedEntryCount > 0) {
        // We only ever send one event at a time
        val failureMessage = result.getEntries.get(0).getErrorMessage
        val errorMessage = s"There was failure writing ${acquisitionJson.spaces2} to Eventbridge: $failureMessage"
        logger.warn(s"$errorMessage")
        promise.success(Left(errorMessage))
      } else {
        promise.success(Right(()))
      }
    } catch {
      case e: SdkException =>
        val errorMessage = s"There was an exception writing ${acquisitionJson.spaces2} to Eventbridge: ${e.getMessage}"
        logger.error(scrub"$errorMessage", e)
        promise.success(Left(errorMessage))
    }
    promise.future
  }
}

object AcquisitionsEventBusService {

  object Sources {
    val paymentApi = "payment-api.1"
    val supportWorkers = "support-workers.1"
  }

  lazy val eventBridgeClient = AmazonEventBridgeClient
    .builder()
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProviderDEPRECATEDV1)
    .build

  /** @param source
    *   \- A string which is passed to the source value of Eventbridge to identify the system that this event comes from
    * @param stage
    *   \- CODE or PROD
    * @param isTestUser
    *   \- Whether the current user is a test user
    * @return
    */
  def apply(source: String, stage: Stage, isTestUser: Boolean = false) =
    new AcquisitionsEventBusService(source, if (isTestUser) CODE else stage, eventBridgeClient)

}
