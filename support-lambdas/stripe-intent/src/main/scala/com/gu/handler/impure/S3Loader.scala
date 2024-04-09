package com.gu.handler.impure

import com.gu.aws.AwsS3Client
import com.gu.aws.AwsS3Client.S3Location
import com.gu.monitoring.SafeLogging
import com.typesafe.config.{Config, ConfigFactory}

object S3Loader extends SafeLogging {
  def load(uri: S3Location): Config = {
    logger.info(s"Loading config from S3 from $uri")
    AwsS3Client
      .fetchAsString(uri)
      .map(
        ConfigFactory.parseString(_).withFallback(ConfigFactory.load()),
      )
      .get
  }
}
