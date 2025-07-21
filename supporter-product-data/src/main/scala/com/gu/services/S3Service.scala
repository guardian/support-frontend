package com.gu.services

import com.gu.aws.CredentialsProvider
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging
import software.amazon.awssdk.core.async.{AsyncRequestBody, AsyncResponseTransformer}
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.{S3AsyncClient, S3Client}
import software.amazon.awssdk.services.s3.model.{GetObjectRequest, PutObjectRequest}

import scala.compat.java8.FutureConverters._
import java.io.InputStream
import java.nio.charset.StandardCharsets
import java.util.concurrent.{ExecutorService, Executors}
import scala.io.Source

object S3Service extends StrictLogging {
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

    val body = RequestBody.fromInputStream(inputStream, length.getOrElse(0))
    s3Client.putObject(putObjectRequest, body)
  }

  def streamFromS3(stage: Stage, filename: String) = {
    logger.info(s"Trying to stream from S3 - bucketName: ${bucketName(stage)}, filename: $filename")
    val request = GetObjectRequest.builder().bucket(bucketName(stage)).key(filename).build()
    s3Client.getObject(request)
  }

  def getAsString(bucket: String, key: String): String = {
    val request = GetObjectRequest.builder().bucket(bucket).key(key).build()
    val responseStream = s3Client.getObject(request)
    val contentAsString = Source.fromInputStream(responseStream)(StandardCharsets.UTF_8).mkString
    responseStream.close()
    contentAsString
  }
}
