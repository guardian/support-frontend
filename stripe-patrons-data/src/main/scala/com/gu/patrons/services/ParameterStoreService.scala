package com.gu.patrons.services

import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.model.{
  GetParameterRequest,
  GetParametersByPathRequest,
  ParameterType,
  PutParameterRequest,
}
import com.amazonaws.services.simplesystemsmanagement.{
  AWSSimpleSystemsManagementAsync,
  AWSSimpleSystemsManagementAsyncClientBuilder,
}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.model.Stage.DEV

import scala.concurrent.ExecutionContext
import scala.jdk.CollectionConverters._

class ParameterStoreService(client: AWSSimpleSystemsManagementAsync, stage: Stage) {
  def parameterKeyFromStage(stage: Stage) = stage match {
    case DEV => "CODE"
    case _ => stage.value
  }
  val configRoot = s"/${parameterKeyFromStage(stage)}/support/stripe-patrons-data/"

  def getParametersByPath(path: String)(implicit executionContext: ExecutionContext) = {
    val request: GetParametersByPathRequest = new GetParametersByPathRequest()
      .withPath(s"$configRoot/$path/")
      .withRecursive(false)
      .withWithDecryption(true)

    AwsAsync(client.getParametersByPathAsync, request).map(_.getParameters.asScala.toList)
  }

  def getParameter(name: String)(implicit executionContext: ExecutionContext) = {
    val request = new GetParameterRequest()
      .withName(s"$configRoot/$name")
      .withWithDecryption(true)

    AwsAsync(client.getParameterAsync, request).map(_.getParameter.getValue)
  }

  def putParameter(name: String, value: String, parameterType: ParameterType = ParameterType.String) = {

    val putParameterRequest = new PutParameterRequest()
      .withName(s"$configRoot/$name")
      .withType(parameterType)
      .withValue(value)
      .withOverwrite(true)

    AwsAsync(client.putParameterAsync, putParameterRequest)
  }

}

object ParameterStoreService {
  lazy val client = AWSSimpleSystemsManagementAsyncClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProvider)
    .build()

  def apply(stage: Stage) = new ParameterStoreService(client, stage)
}
