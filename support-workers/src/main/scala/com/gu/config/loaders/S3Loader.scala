package com.gu.config.loaders

import com.amazonaws.services.s3.AmazonS3URI
import com.gu.aws.AwsS3Client
import com.gu.monitoring.SafeLogger
import com.gu.support.config.Stage
import com.typesafe.config.{Config, ConfigFactory}

class S3Loader extends PrivateConfigLoader {
  override def load(stage: Stage, public: Config): Config = {
    val uri: AmazonS3URI = new AmazonS3URI(public.getString(s"config.private.s3.$stage"))
    SafeLogger.info(s"Loading config from S3 for stage: $stage from $uri")
    AwsS3Client
      .fetchAsString(uri)
      .map(
        ConfigFactory.parseString(_).withFallback(ConfigFactory.load()),
      )
      .get
  }
}
