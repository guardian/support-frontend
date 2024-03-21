package com.gu.support.catalog

import com.gu.aws.AwsS3Client
import com.gu.aws.AwsS3Client.S3Location
import com.typesafe.scalalogging.LazyLogging
import io.circe._
import io.circe.parser._

import scala.util.{Failure, Success}

object AwsS3ClientJson extends LazyLogging {

  def fetchJson(s3Client: AwsS3Client, request: S3Location): Option[Json] = {
    val attempt = for {
      string <- s3Client.fetchAsString(request)
      json <- parse(string).toTry
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
