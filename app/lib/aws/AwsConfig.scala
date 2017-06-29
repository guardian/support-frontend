package lib.aws

import com.typesafe.config.Config

class AwsConfig(config: Config) {
  lazy val useEncryption = config.getBoolean("useEncryption")

  lazy val encryptionKeyId = config.getString("encryptionKeyId")
}