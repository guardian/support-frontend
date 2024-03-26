package com.gu

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{
  AWSCredentialsProviderChain,
  EC2ContainerCredentialsProviderWrapper,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
}
import software.amazon.awssdk.auth.credentials
import software.amazon.awssdk.auth.credentials.AwsCredentialsProviderChain

package object aws {
  val ProfileName = "membership"

  lazy val CredentialsProviderDEPRECATEDV1 = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
    new EnvironmentVariableCredentialsProvider(),
    new EC2ContainerCredentialsProviderWrapper(), // for use with lambda snapstart
  )

  lazy val CredentialsProvider: AwsCredentialsProviderChain =
    credentials.AwsCredentialsProviderChain
      .builder()
      .credentialsProviders(
        credentials.ProfileCredentialsProvider.create(ProfileName),
        credentials.InstanceProfileCredentialsProvider.builder().asyncCredentialUpdateEnabled(false).build(),
        credentials.EnvironmentVariableCredentialsProvider.create(),
        credentials.ContainerCredentialsProvider.builder().build(), // for use with lambda snapstart
      )
      .build()

}
