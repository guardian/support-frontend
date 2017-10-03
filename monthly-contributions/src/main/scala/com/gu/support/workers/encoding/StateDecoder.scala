package com.gu.support.workers.encoding

import java.util.Base64

import com.gu.support.config.AwsConfig
import com.typesafe.scalalogging.LazyLogging

import scala.util.Try

object StateDecoder extends App with LazyLogging {

  if (args.length < 2) {
    println("Please pass in the AWS encryptionKeyId and state")
  }

  val awsEncryptionKeyId = args(0)
  val stepFunctionState = args(1)
  val useEncryption = Try(args(2)).getOrElse("true").toBoolean

  val decoded = Base64.getDecoder.decode(stepFunctionState)

  if (useEncryption)
    decryptState(decoded)
  else
    println(new String(decoded, utf8))

  def decryptState(state: Array[Byte]): Unit = {
    val config = new AwsConfig(true, awsEncryptionKeyId)
    val encoder = new AwsEncryptionProvider(config)
    println(encoder.decrypt(state))
  }

}
