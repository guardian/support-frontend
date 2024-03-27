package com.gu.aws

import com.gu.aws.AwsS3Client.S3Location
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest

import java.io.InputStream
import java.net.URI
import scala.io.Source
import scala.util.Try

object AwsS3Client extends AwsS3Client {

  private val s3: S3Client =
    S3Client
      .builder()
      .region(Region.EU_WEST_1)
      .credentialsProvider(CredentialsProvider)
      .build()

  def withStream[RESULT](s3Location: S3Location)(block: InputStream => Try[RESULT]): Try[RESULT] = {

    val objectRequest: GetObjectRequest = GetObjectRequest.builder
      .key(s3Location.key)
      .bucket(s3Location.bucket)
      .build

    for {
      stream <- Try(s3.getObject(objectRequest))
      result <- block(stream)
      _ = stream.close()
    } yield result
  }

  // convenience method below
  def fetchAsString(s3Location: S3Location): Try[String] =
    withStream(s3Location) { is =>
      Try(Source.fromInputStream(is).mkString)
    }

  case class S3Location(bucket: String, key: String)
  def parseUri(uri: String): Try[S3Location] = Try {
    val s3Uri = s3.utilities().parseUri(URI.create(uri))
    S3Location(
      s3Uri.bucket().get(), // throw if not present
      s3Uri.key().get(),
    )
  }

}
trait AwsS3Client {

  def fetchAsString(s3Location: S3Location): Try[String]

  def parseUri(uri: String): Try[S3Location]

}
