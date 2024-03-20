package com.gu.support.acquisitions

import cats.data.EitherT
import com.google.api.core.{ApiFutureCallback, ApiFutures}
import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.Credentials
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.bigquery.storage.v1.Exceptions.AppendSerializtionError
import com.google.cloud.bigquery.storage.v1._
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.writeAcquisitionDataToBigQueryFailure
import com.gu.monitoring.SafeLogging
import com.gu.support.acquisitions.AcquisitionEventTable.{datasetName, tableName}
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.config.Stage
import org.json.{JSONArray, JSONObject}

import java.io.ByteArrayInputStream
import java.util.concurrent.Executors
import scala.concurrent.{Future, Promise}
import scala.jdk.CollectionConverters._

class BigQueryService(stage: Stage, credentials: Credentials) extends SafeLogging {
  private val projectId = s"datatech-platform-${stage.toString.toLowerCase}"

  lazy val bigQueryWriteSettings =
    BigQueryWriteSettings
      .newBuilder()
      .setQuotaProjectId(projectId)
      .setCredentialsProvider(
        FixedCredentialsProvider.create(credentials),
      )
      .build()
  lazy val bigQueryWriteClient = BigQueryWriteClient.create(bigQueryWriteSettings)
  lazy val tableId = TableName.of(projectId, datasetName, tableName)
  lazy val streamWriter = JsonStreamWriter.newBuilder(tableId.toString, bigQueryWriteClient).build()

  def sendAcquisition(acquisitionDataRow: AcquisitionDataRow): EitherT[Future, String, Unit] =
    EitherT(
      send(acquisitionDataRow),
    )

  /** Release resources held by the service.
    */
  def shutdown(): Unit = {
    streamWriter.close()
    bigQueryWriteClient.close()
  }

  private def send(
      acquisitionDataRow: AcquisitionDataRow,
  ): Future[Either[String, Unit]] = {
    val rowContent: JSONObject = AcquisitionDataRowMapper.mapToTableRow(acquisitionDataRow)
    logger.info(s"Attempting to append row ($rowContent) created from ($acquisitionDataRow)")
    val promise = Promise[Either[String, Unit]]()
    try {
      val responseFuture = streamWriter.append(new JSONArray(List(rowContent).asJava))
      val callback = BigQueryService.AppendCompleteCallback(stage, promise)
      ApiFutures.addCallback(
        responseFuture,
        callback,
        callback.executor,
      )
    } catch {
      case e: AppendSerializtionError =>
        val errorMessage =
          e.getRowIndexToErrorMessage.asScala.map { case (i, message) => s"$i: $message" }.mkString(", ")
        logger.error(scrub"There was an exception appending to $tableName: $errorMessage", e)
        promise.success(Left(s"Error appending to table $tableName: $errorMessage"))
    }
    promise.future
  }
}

object BigQueryService {

  def build(stage: Stage, jsonCredentials: String): BigQueryService =
    new BigQueryService(
      stage,
      GoogleCredentials.fromStream(new ByteArrayInputStream(jsonCredentials.getBytes())),
    )

  case class AppendCompleteCallback(stage: Stage, promise: Promise[Either[String, Unit]])
      extends ApiFutureCallback[AppendRowsResponse]
      with SafeLogging {
    val executor = Executors.newSingleThreadExecutor()

    def onSuccess(response: AppendRowsResponse): Unit = {
      logger.info(s"Rows successfully inserted into table $tableName")
      promise.success(Right(()))
      executor.shutdown()
    }
    def onFailure(throwable: Throwable): Unit = {
      val detail: String = throwable match {
        case e: AppendSerializtionError =>
          e.getRowIndexToErrorMessage.asScala.map { case (i, message) => s"$i: $message" }.mkString(", ")
        case _ => ""
      }
      logger.error(scrub"There was an exception inserting a row into $tableName: $detail", throwable)
      AwsCloudWatchMetricPut(cloudwatchClient)(writeAcquisitionDataToBigQueryFailure(stage))
      promise.success(
        Left(s"There was an exception inserting a row into $tableName: ${throwable.getMessage}; $detail"),
      )
      executor.shutdown()
    }
  }
}
