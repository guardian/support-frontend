package com.gu.aws

import java.io.InputStream

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder, AmazonS3URI}

import scala.io.Source
import scala.util.Try

object AwsS3Client extends AwsS3Client {

  private val s3: AmazonS3 =
    AmazonS3ClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(CredentialsProvider)
      .build()

  def withStream[A](block: InputStream => A)(uri: AmazonS3URI): Try[A] =
    Try(s3.getObject(uri.getBucket, uri.getKey).getObjectContent).map { stream =>
      try {
        block(stream)
      } finally {
        stream.close()
      }
    }

  // convenience method below
  def fetchAsString: AmazonS3URI => Try[String] = withStream(Source.fromInputStream(_).mkString)

}
trait AwsS3Client {

  def fetchAsString: AmazonS3URI => Try[String]

}
