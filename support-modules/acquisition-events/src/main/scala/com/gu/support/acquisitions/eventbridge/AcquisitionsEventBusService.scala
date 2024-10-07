package com.gu.support.acquisitions.eventbridge

import com.gu.aws.CredentialsProvider
import com.gu.monitoring.SafeLogging
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.config.Stage
import com.gu.support.config.Stages.CODE
import io.circe.syntax.EncoderOps
import software.amazon.awssdk.core.exception.SdkException
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.eventbridge.EventBridgeClient
import software.amazon.awssdk.services.eventbridge.model.{PutEventsRequest, PutEventsRequestEntry}

import java.time.Instant
import scala.concurrent.Promise
import scala.jdk.CollectionConverters.SeqHasAsJava
import scala.concurrent.Future

class AcquisitionsEventBusService(source: String, stage: Stage, client: EventBridgeClient) extends SafeLogging {
  val eventBusName: String = s"acquisitions-bus-${stage.toString}"
  val detailType = "AcquisitionsEvent"
  def putAcquisitionEvent(acquisition: AcquisitionDataRow): Future[Either[String, Unit]] = {
    val acquisitionJson = acquisition.asJson
    logger.info(s"Attempting to send event ${acquisitionJson.spaces2}")
    val entry = PutEventsRequestEntry
      .builder()
      .eventBusName(eventBusName)
      .source(source)
      .detailType(detailType)
      .detail(acquisitionJson.noSpaces)
      .time(Instant.now)
      .build()

    val putEventsRequest = PutEventsRequest
      .builder()
      .entries(List(entry).asJava)
      .build()

    val promise = Promise[Either[String, Unit]]
    try {
      val result = client.putEvents(putEventsRequest)
      if (result.failedEntryCount > 0) {
        // We only ever send one event at a time
        val failureMessage = result.entries.get(0).errorMessage
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

  private lazy val eventBridgeClient = EventBridgeClient
    .builder()
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
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
