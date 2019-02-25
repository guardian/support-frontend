package com.gu.ophan

import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.gu.acquisition.services.{DefaultAcquisitionServiceConfig, Ec2OrLocalConfig, LambdaConfig}
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.support.config.Stages

object AcquisitionService {

  def apply(isTestService: Boolean): com.gu.acquisition.services.AcquisitionService =
    if (isTestService) {
      com.gu.acquisition.services.MockAcquisitionService
    } else {

      //Credentials provider is only required if running locally
      val config: DefaultAcquisitionServiceConfig = {
        if (Configuration.stage == Stages.DEV) {
          val credentialsProvider = new AWSCredentialsProviderChain(
            new ProfileCredentialsProvider("membership"),
            InstanceProfileCredentialsProvider.getInstance()
          )

          Ec2OrLocalConfig(credentialsProvider, Configuration.kinesisStreamName)
        } else LambdaConfig(Configuration.kinesisStreamName)
      }

      com.gu.acquisition.services.AcquisitionService.prod(config)(RequestRunners.client)
    }
}
