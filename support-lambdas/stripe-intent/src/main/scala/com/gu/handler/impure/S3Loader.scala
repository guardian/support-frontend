package com.gu.handler.impure

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{
  AWSCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
}
import com.amazonaws.services.s3.AmazonS3URI
import com.gu.aws.AwsS3Client
import com.gu.monitoring.SafeLogger
import com.typesafe.config.{Config, ConfigFactory}

object Aws {

  val ProfileName = "membership"

  lazy val CredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
    new EnvironmentVariableCredentialsProvider(),
  )

}

object S3Loader {
  def load(uri: AmazonS3URI): Config = {
    SafeLogger.info(s"Loading config from S3 from $uri")
    AwsS3Client
      .fetchAsString(uri)
      .map(
        ConfigFactory.parseString(_).withFallback(ConfigFactory.load()),
      )
      .get
  }
}
