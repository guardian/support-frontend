package com.gu.acquisition.services

import java.nio.ByteBuffer

import com.gu.support.acquisitions.AcquisitionDataRow

import cats.data.EitherT
import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.services.kinesis.AmazonKinesisAsyncClientBuilder
import com.amazonaws.services.kinesis.model.{PutRecordRequest, PutRecordResult}
import com.amazonaws.auth.AWSCredentialsProviderChain

import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.control.NonFatal

import org.joda.time.format.ISODateTimeFormat

import io.circe.syntax._

sealed trait AcquisitionsStreamServiceConfig {
  val streamName: String
}

case class Ec2OrLocalConfig(val streamName: String, val credentialsProvider: AWSCredentialsProviderChain) extends AcquisitionsStreamServiceConfig
case class LambdaConfig(val streamName: String) extends AcquisitionsStreamServiceConfig

class AcquisitionsStreamService(config: AcquisitionsStreamServiceConfig, region: String = "eu-west-1") {

  private val kinesisClient = {
    val builder = AmazonKinesisAsyncClientBuilder.standard().withRegion(region)
    config match {
      case Ec2OrLocalConfig(_,provider) => builder.withCredentials(provider).build
      case _: LambdaConfig => builder.build
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

    kinesisClient.putRecordAsync(request, new AsyncHandler[PutRecordRequest, PutRecordResult] {
      override def onError(exception: Exception): Unit = promise.failure(exception)

      override def onSuccess(request: PutRecordRequest, result: PutRecordResult): Unit = promise.success(Right(()))
    })

    EitherT(promise.future)
  }
}
