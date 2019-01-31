package com.gu.support.catalog

import com.gu.aws.CredentialsProvider
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.model.{GetObjectRequest, S3ObjectInputStream}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.LazyLogging
import io.circe._
import io.circe.parser._

import scala.io.Source
import scala.util.{Failure, Success, Try}

object AwsS3Client extends LazyLogging{

  implicit val s3: AmazonS3 =
    AmazonS3ClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(CredentialsProvider)
      .build()

  def fetchObject(s3Client: AmazonS3, request: GetObjectRequest): Try[S3ObjectInputStream] = Try(s3Client.getObject(request).getObjectContent)

  def fetchJson(s3Client: AmazonS3, request: GetObjectRequest): Option[Json] = {
    val attempt = for {
      s3Stream <- fetchObject(s3Client, request)
      json <- parse(Source.fromInputStream(s3Stream).mkString).toTry
      _ <- Try(s3Stream.close())
    } yield json
    attempt match {
      case Success(json) => Some(json)
      case Failure(ex) => {
        logger.warn(s"Couldn't get catalog", ex)
        None
      }
    }
  }
}
