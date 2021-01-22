package com.gu.services

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.{GetObjectRequest, ObjectMetadata}
import com.amazonaws.services.s3.transfer.TransferManagerBuilder
import com.gu.aws.CredentialsProvider

import java.io.InputStream
import java.util.UUID
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, blocking}

object S3Service {
  val bucketName = "supporter-product-export-code"
  val s3Client = AmazonS3ClientBuilder.standard
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProvider)
    .build
  val transferManager = TransferManagerBuilder.standard
    .withS3Client(s3Client)
    .build

  def streamToS3(filename: String, inputStream: InputStream, length: Long) = {
    // Specify server-side encryption.
    val objectMetadata = new ObjectMetadata()
    objectMetadata.setContentLength(length)
    objectMetadata.setSSEAlgorithm(ObjectMetadata.AES_256_SERVER_SIDE_ENCRYPTION)

    val upload = transferManager.upload(
      bucketName,
      filename,
      inputStream,
      objectMetadata
    )

    Future(
      blocking(upload.waitForUploadResult())
    )
  }

  def streamFromS3(filename: String) = {
    val fullObject = s3Client.getObject(new GetObjectRequest(bucketName, filename))
    fullObject.getObjectContent
  }
}
