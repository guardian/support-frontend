package com.gu.support.idealpostcodes

import com.gu.aws.ProfileName
import com.gu.conf._
import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners
import com.gu.support.config.IdealPostcodesConfig
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider,
}

@IntegrationTest
class IdealPostcodesServiceITSpec extends AsyncFlatSpec with Matchers {
  private lazy val credentialsProvider = AwsCredentialsProviderChain.builder
    .credentialsProviders(
      ProfileCredentialsProvider.builder.profileName(ProfileName).build,
      InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
      EnvironmentVariableCredentialsProvider.create(),
    )
    .build
  private lazy val parameterStoreConfig = SSMConfigurationLocation(s"/support/frontend/CODE", "eu-west-1").load(
    credentialsProvider,
  )
  private lazy val apiKey = parameterStoreConfig.getString("ideal-postcodes-api.key")
  private lazy val service =
    new IdealPostcodesService(IdealPostcodesConfig(apiKey), RequestRunners.futureRunner)

  "IdealPostcodesService" should "be able to find a postcode" ignore {
    service.find("N19GU").map { result =>
      result.nonEmpty shouldBe true
      val address = result.head
      address.postCode shouldBe Some("N1 9GU")
      address.lineOne shouldBe Some("The Guardian Media Group")
      address.lineTwo shouldBe Some("Kings Place")
      address.city shouldBe Some("London")
      address.state shouldBe Some("London")
      address.country shouldBe Country.UK
    }
  }

  it should "be able to find another postcode" ignore {
    service.find("NN13ER").map { result =>
      result.head.state shouldBe Some("Northamptonshire")
    }
  }
}
