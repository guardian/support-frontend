package com.gu.aws

import com.typesafe.config.Config

case class AwsConfig(useEncryption: Boolean, encryptionKeyId: String)

object AwsConfig {
  def fromConfig(config: Config): AwsConfig = AwsConfig(
    useEncryption = config.getBoolean("aws.useEncryption"),
    encryptionKeyId = config.getString("aws.encryptionKeyId")
  )
}
