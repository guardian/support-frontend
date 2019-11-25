package com.gu.support.workers.encoding

import java.util.Base64

import com.gu.config.Configuration
import com.gu.support.config.AwsConfig
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonWrapper
import com.typesafe.scalalogging.LazyLogging
import io.circe.Printer
import io.circe.generic.auto._
import io.circe.parser._

import scala.util.Try

object StateDecoder extends App with LazyLogging {

  if (args.length < 1) {
    //scalastyle:off regex
    println("Please pass in the Json state and optionally the AWS encryption key ARN if different from the DEV config")
  }

  decode[JsonWrapper](args(0)).fold(println(_), { jsonWrapper =>
    val awsEncryptionKeyId = Try(args(1)).getOrElse(Configuration.encryptionKeyId)

    val decoded = Base64.getDecoder.decode(jsonWrapper.state)

    if (jsonWrapper.requestInfo.encrypted)
      decryptState(decoded)
    else
      print(new String(decoded, utf8))

    def decryptState(state: Array[Byte]): Unit = {
      val config = new AwsConfig(true, awsEncryptionKeyId)
      val encoder = new AwsEncryptionProvider(awsEncryptionKeyId)
      print(encoder.decrypt(state))
    }
  })

  def print(output: String): Unit = {
    val formattedOutput = parse(output).map(_.pretty(Printer.indented(" "))).getOrElse(output)
    println(s"\n\n$formattedOutput\n\n")
  } // scalastyle:ignore
}
