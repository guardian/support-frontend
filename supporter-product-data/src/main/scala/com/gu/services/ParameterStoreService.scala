package com.gu.services

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{
  AWSCredentialsProviderChain,
  EC2ContainerCredentialsProviderWrapper,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
}
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
import com.gu.AwsAsync
import com.gu.aws.ProfileName
import com.gu.supporterdata.model.Stage

import scala.concurrent.ExecutionContext
import scala.jdk.CollectionConverters._

class ParameterStoreService(client: AWSSimpleSystemsManagementAsync, stage: Stage) {
  val configRoot = s"/supporter-product-data/${stage.value}"

  def getParametersByPath(path: String)(implicit executionContext: ExecutionContext) = {
    val request: GetParametersByPathRequest = new GetParametersByPathRequest()
      .withPath(s"$configRoot/$path/")
      .withRecursive(false)
      .withWithDecryption(true)
    client.getParametersByPath(request).getParameters.asScala.toList
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
  // please update to AWS SDK 2 and use com.gu.aws.CredentialsProvider
  lazy val CredentialsProviderDEPRECATEDV1 = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
    new EnvironmentVariableCredentialsProvider(),
    new EC2ContainerCredentialsProviderWrapper(), // for use with lambda snapstart
  )

  lazy val client = AWSSimpleSystemsManagementAsyncClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProviderDEPRECATEDV1)
    .build()

  def apply(stage: Stage) = new ParameterStoreService(client, stage)
}
