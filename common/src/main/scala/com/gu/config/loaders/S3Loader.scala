package com.gu.config.loaders

import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.{AmazonS3Client, AmazonS3URI}
import com.gu.aws.CredentialsProvider
import com.gu.config.Stage
import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging

import scala.io.{BufferedSource, Source}

class S3Loader extends PrivateConfigLoader with LazyLogging {
  override def load(stage: Stage, public: Config) = {
    logger.info(s"Loading config from S3 for stage: ${stage.name}")
    val s3Client = new AmazonS3Client(CredentialsProvider)
    val uri: AmazonS3URI = new AmazonS3URI(public.getString(s"config.private.s3.${stage.name}"))
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
