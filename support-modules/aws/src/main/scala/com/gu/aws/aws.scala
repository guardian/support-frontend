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
        credentials.EnvironmentVariableCredentialsProvider.create(),
        credentials.ContainerCredentialsProvider.builder().build(), // for use with lambda snapstart
        credentials.InstanceProfileCredentialsProvider
          .builder()
          .asyncCredentialUpdateEnabled(false)
          .build(), // last because it takes 2s to fail in Lambda/local
      )
      .build()

}
