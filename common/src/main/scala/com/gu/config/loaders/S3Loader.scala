package com.gu.config.loaders

import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.{AmazonS3Client, AmazonS3URI}
import com.gu.aws.CredentialsProvider
import com.typesafe.config.ConfigFactory

import scala.io.{BufferedSource, Source}

class S3Loader extends ConfigLoader{
  def load() = {

    val s3Client = new AmazonS3Client(CredentialsProvider)
    val uri: AmazonS3URI = new AmazonS3URI("s3://support-workers-private/DEV/support.private.conf")
    val s3Object: S3Object = s3Client.getObject(uri.getBucket, uri.getKey)

    val source: BufferedSource = Source.fromInputStream(s3Object.getObjectContent)
    try {
      source.mkString
    } finally {
      source.close()
    }
    ConfigFactory.empty()
  }

}
