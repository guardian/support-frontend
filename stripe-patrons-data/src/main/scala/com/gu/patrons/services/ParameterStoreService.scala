package com.gu.patrons.services

import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.ssm.SsmClient
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest
import com.gu.aws.CredentialsProvider
import com.gu.supporterdata.model.Stage

import scala.jdk.CollectionConverters._

class ParameterStoreService(client: SsmClient, stage: Stage) {
  val configRoot = s"/$stage/support/stripe-patrons-data"

  def getParametersByPathSync(path: String) = {
    val request: GetParametersByPathRequest = GetParametersByPathRequest
      .builder()
      .path(s"$configRoot/$path/")
      .recursive(false)
      .withDecryption(true)
      .build()

    client.getParametersByPath(request).parameters().asScala.toList
  }
}

object ParameterStoreService {

  val client = SsmClient
    .builder()
    .credentialsProvider(CredentialsProvider)
    .region(Region.EU_WEST_1)
    .build()

  def apply(stage: Stage) = new ParameterStoreService(client, stage)
}
