package com.gu.support.workers.encoding

import java.util.Base64

import com.gu.support.config.AwsConfig
import com.typesafe.scalalogging.LazyLogging

object StateDecoder extends App with LazyLogging {

  if (args.length < 2) {
    println("Please pass in the AWS encryptionKeyId and state")
  }

  def decodeState(key: String, state: String): Unit = {
    val config = new AwsConfig(true, key)
    val encoder = new AwsEncryptionProvider(config)
    val decoded = Base64.getDecoder.decode(state)
    println(encoder.decrypt(decoded))
  }

  decodeState(args(0), args(1))
}
