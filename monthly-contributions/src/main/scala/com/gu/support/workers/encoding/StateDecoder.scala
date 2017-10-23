package com.gu.support.workers.encoding

import java.util.Base64

import com.gu.config.Configuration
import com.gu.support.config.AwsConfig
import com.gu.support.workers.model.JsonWrapper
import com.gu.zuora.encoding.CustomCodecs.jsonWrapperDecoder
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._

import scala.util.Try

object StateDecoder extends App with LazyLogging {

  if (args.length < 1) {
    print("Please pass in the Json state and optionally the AWS encryption key ARN if different from the DEV config")
  }

  val jsonWrapper = decode[JsonWrapper](args(0)).right.get
  val awsEncryptionKeyId = Try(args(1)).getOrElse(Configuration.encryptionKeyId)

  val decoded = Base64.getDecoder.decode(jsonWrapper.state)

  if (jsonWrapper.encrypted)
    decryptState(decoded)
  else
    print(new String(decoded, utf8))

  def decryptState(state: Array[Byte]): Unit = {
    val config = new AwsConfig(true, awsEncryptionKeyId)
    val encoder = new AwsEncryptionProvider(awsEncryptionKeyId)
    print(encoder.decrypt(state))
  }

  def print(output: String): Unit = println(s"\n\n$output\n\n") // scalastyle:ignore
}
