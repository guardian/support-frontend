package com.gu.services

import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.ssm.{SsmAsyncClient, SsmClient}
import software.amazon.awssdk.services.ssm.model.{
  GetParameterRequest,
  GetParametersByPathRequest,
  ParameterType,
  PutParameterRequest,
}
import com.gu.aws.CredentialsProvider
import com.gu.AwsAsync
import com.gu.supporterdata.model.Stage

import scala.concurrent.ExecutionContext
import scala.jdk.CollectionConverters._

class ParameterStoreService(client: SsmClient, asyncClient: SsmAsyncClient, stage: Stage) {
  val configRoot = s"/supporter-product-data/${stage.value}"

  def getParametersByPath(path: String)(implicit executionContext: ExecutionContext) = {
    val request: GetParametersByPathRequest = GetParametersByPathRequest
      .builder()
      .path(s"$configRoot/$path/")
      .recursive(false)
      .withDecryption(true)
      .build()

    client.getParametersByPath(request).parameters().asScala.toList
  }

  def getParameter(name: String)(implicit executionContext: ExecutionContext) = {
    val request = GetParameterRequest
      .builder()
      .name(s"$configRoot/$name")
      .withDecryption(true)
      .build()

    AwsAsync((request: GetParameterRequest) => asyncClient.getParameter(request), request).map(_.parameter().value())
  }

  def putParameter(name: String, value: String) = {
    val putParameterRequest = PutParameterRequest
      .builder()
      .name(s"$configRoot/$name")
      .`type`(ParameterType.STRING)
      .value(value)
      .overwrite(true)
      .build()

    AwsAsync((request: PutParameterRequest) => asyncClient.putParameter(request), putParameterRequest)
  }

}

object ParameterStoreService {
  lazy val client: SsmClient = SsmClient
    .builder()
    .credentialsProvider(CredentialsProvider)
    .region(Region.EU_WEST_1)
    .build()

  lazy val asyncClient: SsmAsyncClient = SsmAsyncClient
    .builder()
    .credentialsProvider(CredentialsProvider)
    .region(Region.EU_WEST_1)
    .build()

  def apply(stage: Stage) = new ParameterStoreService(client, asyncClient, stage)
}
