package com.gu.support.acquisitions

import java.nio.ByteBuffer

import com.gu.support.acquisitions.models.AcquisitionDataRow

import cats.data.EitherT
import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.services.kinesis.AmazonKinesisAsyncClientBuilder
import com.amazonaws.services.kinesis.model.{PutRecordRequest, PutRecordResult}
import com.amazonaws.auth.AWSCredentialsProviderChain

import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.control.NonFatal

import org.joda.time.format.ISODateTimeFormat

import io.circe.syntax._
import com.gu.support.acquisitions.utils.Retry

sealed trait AcquisitionsStreamServiceConfig {
  val streamName: String
}

case class AcquisitionsStreamEc2OrLocalConfig(
    val streamName: String,
    val credentialsProvider: AWSCredentialsProviderChain,
) extends AcquisitionsStreamServiceConfig
case class AcquisitionsStreamLambdaConfig(val streamName: String) extends AcquisitionsStreamServiceConfig

trait AcquisitionsStreamService {
  def putAcquisition(acquisition: AcquisitionDataRow): EitherT[Future, String, Unit]

  def putAcquisitionWithRetry(acquisition: AcquisitionDataRow, maxRetries: Int)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, List[String], Unit] =
    Retry(maxRetries)(putAcquisition(acquisition))
}

class AcquisitionsStreamServiceImpl(config: AcquisitionsStreamServiceConfig, region: String = "eu-west-1")
    extends AcquisitionsStreamService {

  private val kinesisClient = {
    val builder = AmazonKinesisAsyncClientBuilder.standard().withRegion(region)
    config match {
      case AcquisitionsStreamEc2OrLocalConfig(_, provider) => builder.withCredentials(provider).build
      case _: AcquisitionsStreamLambdaConfig => builder.build
    }
  }

  def putAcquisition(acquisition: AcquisitionDataRow): EitherT[Future, String, Unit] = {
    val promise = Promise[Either[String, Unit]]()

    val request: PutRecordRequest = {
      val buffer = ByteBuffer.wrap {
        acquisition.asJson.noSpaces.getBytes
      }

      new PutRecordRequest()
        .withStreamName(config.streamName)
        .withPartitionKey(ISODateTimeFormat.dateTime().print(acquisition.eventTimeStamp))
        .withData(buffer)
    }

    kinesisClient.putRecordAsync(
      request,
      new AsyncHandler[PutRecordRequest, PutRecordResult] {
        override def onError(exception: Exception): Unit = promise.success(Left(exception.getMessage))

        override def onSuccess(request: PutRecordRequest, result: PutRecordResult): Unit = promise.success(Right(()))
      },
    )

    EitherT(promise.future)
  }
}
