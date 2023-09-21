package com.gu.support.acquisitions.eventbridge

import com.gu.aws.ProfileName
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.acquisitions.AcquisitionDataRowMapper
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.config.Stage
import com.gu.support.config.Stages.CODE
import org.json.JSONObject
import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider,
}
import software.amazon.awssdk.core.exception.SdkException
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.eventbridge.EventBridgeClient
import software.amazon.awssdk.services.eventbridge.model.{PutEventsRequest, PutEventsRequestEntry}

import java.time.Instant
import scala.concurrent.Promise

class AcquisitionsEventBusService(source: String, stage: Stage, client: EventBridgeClient) {
  val eventBusName = s"acquisitions-bus-${stage.toString}"
  val detailType = "AcquisitionsEvent"
  def putAcquisitionEvent(acquisition: AcquisitionDataRow) = {
    val acquisitionDataRow: JSONObject = AcquisitionDataRowMapper.mapToTableRow(acquisition)
    SafeLogger.info(s"Attempting to send event $acquisitionDataRow")
    val entry = PutEventsRequestEntry.builder
      .eventBusName(eventBusName)
      .source(source)
      .detailType(detailType)
      .detail(acquisitionDataRow.toString)
      .time(Instant.now)
      .build

    val putEventsRequest = PutEventsRequest.builder.entries(entry).build

    val promise = Promise[Either[String, Unit]]
    try {
      val result = client.putEvents(putEventsRequest)
      if (result.failedEntryCount > 0) {
        // We only ever send one event at a time
        val failureMessage = result.entries.get(0).errorMessage
        val errorMessage = s"There was failure writing $acquisitionDataRow to Eventbridge: $failureMessage"
        SafeLogger.warn(s"$errorMessage")
        promise.success(Left(errorMessage))
      } else {
        promise.success(Right(()))
      }
    } catch {
      case e: SdkException =>
        val errorMessage = s"There was an exception writing $acquisitionDataRow to Eventbridge: ${e.getMessage}"
        SafeLogger.error(scrub"$errorMessage", e)
        promise.success(Left(errorMessage))
    }
    promise.future
  }
}

object AcquisitionsEventBusService {
  lazy val CredentialsProvider = AwsCredentialsProviderChain.builder
    .credentialsProviders(
      ProfileCredentialsProvider.builder.profileName(ProfileName).build,
      InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
      EnvironmentVariableCredentialsProvider.create(),
    )
    .build

  lazy val eventBridgeClient = EventBridgeClient.builder
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
    .build

  /** @param source
    *   \- A string which is passed to the source value of Eventbridge to identify the system that this event comes from
    * @param stage
    * @param isTestUser
    * @return
    */
  def apply(source: String, stage: Stage, isTestUser: Boolean) =
    new AcquisitionsEventBusService(source, if (isTestUser) CODE else stage, eventBridgeClient)
}
