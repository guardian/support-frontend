package com.gu.services

import com.gu.aws.CredentialsProvider
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging
import software.amazon.awssdk.core.async.{AsyncRequestBody, AsyncResponseTransformer}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.{S3AsyncClient, S3Client}
import software.amazon.awssdk.services.s3.model.{GetObjectRequest, PutObjectRequest}

import scala.compat.java8.FutureConverters._
import java.io.InputStream
import java.util.concurrent.{ExecutorService, Executors}

object S3Service extends StrictLogging {
  // TODO: what should the size of this thread pool be?
  val executor: ExecutorService = Executors.newFixedThreadPool(2)

  val s3Client: S3Client = S3Client
    .builder()
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
    .build()

  def bucketName(stage: Stage) = s"supporter-product-data-export-${stage.value.toLowerCase}"

  def streamToS3(stage: Stage, filename: String, inputStream: InputStream, length: Option[Long]) = {
    logger.info(s"Trying to stream to S3 - bucketName: ${bucketName(stage)}, filename: $filename, length: $length")

    val putObjectRequest = PutObjectRequest
      .builder()
      .bucket(bucketName(stage))
      .key(filename)
      .build()

    // Upload using the stream and convert to Scala Future
    val body = AsyncRequestBody.fromInputStream(inputStream, length.getOrElse(0), executor)
    s3Client.putObject(putObjectRequest, body).toScala
  }

  def streamFromS3(stage: Stage, filename: String) = {
    logger.info(s"Trying to stream from S3 - bucketName: ${bucketName(stage)}, filename: $filename")
    val request = GetObjectRequest.builder().bucket(bucketName(stage)).key(filename).build()
    s3Client.getObject(request)
  }
}
