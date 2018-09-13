package wiring

import config.{Configuration, StringsConfig}
import services.aws.AwsS3Client.s3

trait ApplicationConfiguration {
  val appConfig = new Configuration()
  val stringsConfig = new StringsConfig()
}
