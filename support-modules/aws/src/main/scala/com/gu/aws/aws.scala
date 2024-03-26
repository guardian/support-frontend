package com.gu

import software.amazon.awssdk.auth.credentials
import software.amazon.awssdk.auth.credentials.AwsCredentialsProviderChain

package object aws {
  val ProfileName = "membership"

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
