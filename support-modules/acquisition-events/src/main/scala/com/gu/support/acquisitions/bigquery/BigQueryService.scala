package com.gu.support.acquisitions

import cats.data.EitherT
import com.google.api.core.ApiFutureCallback
import com.google.api.core.ApiFutures
import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.Credentials
import com.google.auth.oauth2.{GoogleCredentials, ServiceAccountCredentials}
import com.google.cloud.bigquery.storage.v1.{
  AppendRowsResponse,
  BigQueryWriteClient,
  BigQueryWriteSettings,
  JsonStreamWriter,
  TableName,
}
import com.google.cloud.bigquery.storage.v1.Exceptions.AppendSerializtionError
import com.google.cloud.bigquery.BigQueryOptions
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.writeAcquisitionDataToBigQueryFailure
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.acquisitions.AcquisitionEventTable.{datasetName, tableName}
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.acquisitions.utils.Retry
import com.gu.support.config.Stage
import com.gu.support.config.Stages._
import org.json.{JSONArray, JSONObject}

import java.io.ByteArrayInputStream
import java.util.concurrent.Executors
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.jdk.CollectionConverters._

class BigQueryService(credentials: Credentials) {
  private val stage: Stage = sys.env.get("STAGE").flatMap(Stage.fromString).getOrElse(CODE)
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
  lazy val streamWriter = JsonStreamWriter.newBuilder(tableId.toString(), bigQueryWriteClient).build();

  def tableInsertRowWithRetry(acquisitionDataRow: AcquisitionDataRow, maxRetries: Int)(implicit
      executionContext: ExecutionContext,
  ): EitherT[Future, List[String], Unit] = Retry(maxRetries)(sendAcquisition(acquisitionDataRow))

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
    SafeLogger.info(s"Attempting to append row ($rowContent) created from ($acquisitionDataRow)")
    val promise = Promise[Either[String, Unit]]()
    try {
      val responseFuture = streamWriter.append(new JSONArray(List(rowContent).asJava));
      val callback = new BigQueryService.AppendCompleteCallback(stage, promise);
      ApiFutures.addCallback(
        responseFuture,
        callback,
        callback.executor,
      )
    } catch {
      case e: AppendSerializtionError =>
        val errorMessage =
          e.getRowIndexToErrorMessage().asScala.map { case (i, message) => s"$i: $message" }.mkString(", ")
        SafeLogger.error(scrub"There was an exception appending to $tableName: $errorMessage", e)
        promise.success(Left(s"Error appending to table $tableName: $errorMessage"))
    }
    promise.future
  }
}

object BigQueryService {

  def build(jsonCredentials: String): BigQueryService =
    new BigQueryService(
      GoogleCredentials.fromStream(new ByteArrayInputStream(jsonCredentials.getBytes())),
    )

  def build(config: BigQueryConfig): BigQueryService =
    new BigQueryService(
      ServiceAccountCredentials.fromPkcs8(
        config.clientId,
        config.clientEmail,
        config.privateKey,
        config.privateKeyId,
        Nil.asJavaCollection,
      ),
    )

  case class AppendCompleteCallback(stage: Stage, promise: Promise[Either[String, Unit]])
      extends ApiFutureCallback[AppendRowsResponse] {
    val executor = Executors.newSingleThreadExecutor();

    def onSuccess(response: AppendRowsResponse): Unit = {
      SafeLogger.info(s"Rows successfully inserted into table $tableName")
      promise.success(Right(()))
      executor.shutdown()
    }
    def onFailure(throwable: Throwable): Unit = {
      val detail: String = throwable match {
        case e: AppendSerializtionError => {
          e.getRowIndexToErrorMessage().asScala.map { case (i, message) => s"$i: $message" }.mkString(", ")
        }
        case _ => ""
      }
      SafeLogger.error(scrub"There was an exception inserting a row into $tableName: $detail", throwable)
      AwsCloudWatchMetricPut(cloudwatchClient)(writeAcquisitionDataToBigQueryFailure(stage))
      promise.success(
        Left(s"There was an exception inserting a row into $tableName: ${throwable.getMessage}; $detail"),
      )
      executor.shutdown()
    }
  }
}
