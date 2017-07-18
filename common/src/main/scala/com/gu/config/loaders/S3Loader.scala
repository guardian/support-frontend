package com.gu.config.loaders

import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.{AmazonS3ClientBuilder, AmazonS3URI}
import com.gu.aws.CredentialsProvider
import com.gu.support.config.Stage
import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging

import scala.io.{BufferedSource, Source}

class S3Loader extends PrivateConfigLoader with LazyLogging {
  override def load(stage: Stage, public: Config): Config = {
    logger.info(s"Loading config from S3 for stage: $stage")
    val s3Client = AmazonS3ClientBuilder
      .standard()
      .withCredentials(CredentialsProvider)
      .build()
    val uri: AmazonS3URI = new AmazonS3URI(public.getString(s"config.private.s3.$stage"))
    val s3Object: S3Object = s3Client.getObject(uri.getBucket, uri.getKey)

    val source: BufferedSource = Source.fromInputStream(s3Object.getObjectContent)
    try {
      val conf = source.mkString
      ConfigFactory.parseString(conf).withFallback(public)
    } finally {
      source.close()
    }
  }
}
