package com.gu.services

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.{GetObjectRequest, ObjectMetadata, PutObjectRequest}
import com.amazonaws.services.s3.transfer.TransferManagerBuilder
import com.gu.aws.CredentialsProvider
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging

import java.io.InputStream

object S3Service extends StrictLogging {
  val s3Client = AmazonS3ClientBuilder.standard
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProvider)
    .build
  val transferManager = TransferManagerBuilder.standard
    .withS3Client(s3Client)
    .build

  def bucketName(stage: Stage) = s"supporter-product-data-export-${stage.value.toLowerCase}"

  def streamToS3(stage: Stage, filename: String, inputStream: InputStream, length: Long) = {
    logger.info(s"Trying to stream to S3 - bucketName: ${bucketName(stage)}, filename: $filename, length: $length")
    val objectMetadata = new ObjectMetadata()
    objectMetadata.setContentLength(length)

    val putObjectRequest = new PutObjectRequest(bucketName(stage), filename, inputStream, objectMetadata)
    val transfer = transferManager.upload(putObjectRequest)

    transfer.waitForCompletion()
  }

  def streamFromS3(stage: Stage, filename: String) =
    s3Client.getObject(new GetObjectRequest(bucketName(stage), filename))

}
