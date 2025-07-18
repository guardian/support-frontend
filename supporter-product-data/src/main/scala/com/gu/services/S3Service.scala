package com.gu.services

import com.gu.aws.CredentialsProvider
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging
import software.amazon.awssdk.core.async.AsyncResponseTransformer
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3AsyncClient
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.transfer.s3.S3TransferManager
import scala.compat.java8.FutureConverters._

import java.io.InputStream

object S3Service extends StrictLogging {
  val s3Client: S3AsyncClient = S3AsyncClient
    .builder()
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
    .build()

  val transferManager = S3TransferManager
    .builder()
    .s3Client(s3Client)
    .build()

  def bucketName(stage: Stage) = s"supporter-product-data-export-${stage.value.toLowerCase}"

  def streamToS3(stage: Stage, filename: String, inputStream: InputStream, length: Option[Long]) = {
    logger.info(s"Trying to stream to S3 - bucketName: ${bucketName(stage)}, filename: $filename, length: $length")
    val objectMetadata = new ObjectMetadata()
    if (length.isDefined) {
      objectMetadata.setContentLength(length.get)
    }
    val putObjectRequest = new PutObjectRequest(bucketName(stage), filename, inputStream, objectMetadata)
    val transfer = transferManager.upload(putObjectRequest)

    transfer.waitForCompletion()
  }

  def streamFromS3(stage: Stage, filename: String) = {
    logger.info(s"Trying to stream from S3 - bucketName: ${bucketName(stage)}, filename: $filename")
    val request = new GetObjectRequest(bucketName(stage), filename)
    s3Client.getObject(request, AsyncResponseTransformer.toBytes()).toScala
  }
}
