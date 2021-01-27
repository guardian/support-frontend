package com.gu.services

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.{GetObjectRequest, ObjectMetadata}
import com.amazonaws.services.s3.transfer.TransferManagerBuilder
import com.gu.aws.CredentialsProvider
import com.gu.model.Stage
import com.gu.monitoring.SafeLogger

import java.io.InputStream
import java.util.UUID
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, blocking}

object S3Service {
  val s3Client = AmazonS3ClientBuilder.standard
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProvider)
    .build
  val transferManager = TransferManagerBuilder.standard
    .withS3Client(s3Client)
    .build

  def bucketName(stage: Stage) = s"supporter-product-data-export-${stage.value}"

  def streamToS3(stage: Stage, filename: String, inputStream: InputStream, length: Long) = {
    // Specify server-side encryption.
    val objectMetadata = new ObjectMetadata()
    objectMetadata.setContentLength(length)
    objectMetadata.setSSEAlgorithm(ObjectMetadata.AES_256_SERVER_SIDE_ENCRYPTION)

    val upload = transferManager.upload(
      bucketName(stage),
      filename,
      inputStream,
      objectMetadata
    )

    Future(
      blocking(upload.waitForUploadResult())
    )
  }

  def streamFromS3(stage: Stage, filename: String) = {
    val fullObject = s3Client.getObject(new GetObjectRequest(bucketName(stage), filename))
    fullObject.getObjectContent
  }
}
