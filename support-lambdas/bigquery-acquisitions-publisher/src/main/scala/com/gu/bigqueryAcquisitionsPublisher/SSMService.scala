package com.gu.bigqueryAcquisitionsPublisher

import cats.syntax.either._
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{
  AWSCredentialsProviderChain,
  EC2ContainerCredentialsProviderWrapper,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
}
import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementClientBuilder
import com.amazonaws.services.simplesystemsmanagement.model.GetParameterRequest
import com.gu.aws.ProfileName

import scala.util.Try

object SSMService {

  // please update to AWS SDK 2 and use com.gu.aws.CredentialsProvider
  lazy val CredentialsProviderDEPRECATEDV1 = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
    new EnvironmentVariableCredentialsProvider(),
    new EC2ContainerCredentialsProviderWrapper(), // for use with lambda snapstart
  )

  val client = AWSSimpleSystemsManagementClientBuilder
    .standard()
    .withCredentials(CredentialsProviderDEPRECATEDV1)
    .withRegion(Regions.EU_WEST_1)
    .build()

  def getParam(path: String): Either[String, String] = {
    val request = new GetParameterRequest()
      .withName(path)
      .withWithDecryption(true)
    Try(client.getParameter(request)).toEither
      .leftMap(error => error.getMessage)
      .map(result => result.getParameter.getValue)
  }
}
