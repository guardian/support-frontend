package com.gu.patrons.services

import com.amazonaws.event.ProgressEventType._
import com.amazonaws.event.{ProgressEvent, ProgressListener}
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.{GetObjectRequest, ObjectMetadata, PutObjectRequest}
import com.amazonaws.services.s3.transfer.TransferManagerBuilder
import com.gu.aws.CredentialsProvider
import com.gu.supporterdata.model.Stage

import java.io.InputStream
import scala.concurrent.Promise

object S3Service {
  val s3Client = AmazonS3ClientBuilder.standard
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProvider)
    .build
  val transferManager = TransferManagerBuilder.standard
    .withS3Client(s3Client)
    .build

  def bucketName(stage: Stage) = s"supporter-product-data-export-${stage.value.toLowerCase}"

  def streamToS3(stage: Stage, filename: String, inputStream: InputStream, length: Long) = {
    val objectMetadata = new ObjectMetadata()
    objectMetadata.setContentLength(length)
    val putObjectRequest = new PutObjectRequest(bucketName(stage), filename, inputStream, objectMetadata)
    val progressListener = new TransferProgressListener(filename)
    putObjectRequest.setGeneralProgressListener(progressListener)
    transferManager.upload(putObjectRequest)
    progressListener.future
  }

  def streamFromS3(stage: Stage, filename: String) =
    s3Client.getObject(new GetObjectRequest(bucketName(stage), filename))

}

class TransferProgressListener(filename: String) extends ProgressListener {

  private val promise = Promise[Unit]()
  def future = promise.future

  override def progressChanged(progressEvent: ProgressEvent): Unit =
    progressEvent.getEventType match {
      case TRANSFER_COMPLETED_EVENT => promise.success(())
      case TRANSFER_PART_FAILED_EVENT =>
        promise.failure(new RuntimeException(s"There was a partial failure while transferring $filename"))
      case TRANSFER_FAILED_EVENT | TRANSFER_CANCELED_EVENT =>
        promise.failure(new RuntimeException(s"Transfer failed for $filename"))
      case _ => ()
    }
}
