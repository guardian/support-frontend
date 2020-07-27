package com.gu.aws

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.model.{GetObjectRequest, S3ObjectInputStream}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}

import scala.io.Source
import scala.util.{Failure, Success, Try}

object AwsS3Client {

  implicit val s3: AmazonS3 =
    AmazonS3ClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(CredentialsProvider)
      .build()

  def fetchObject(s3Client: AmazonS3, request: GetObjectRequest): Try[S3ObjectInputStream] =
    Try(s3Client.getObject(request).getObjectContent)

}
