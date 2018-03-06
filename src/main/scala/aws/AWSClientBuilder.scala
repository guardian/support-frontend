package aws

import com.amazonaws.auth.AWSCredentialsProviderChain
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.simplesystemsmanagement.{AWSSimpleSystemsManagement, AWSSimpleSystemsManagementClientBuilder}
import com.amazonaws.regions.Regions

object AWSClientBuilder {

  private val credentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("membership")
  )

  def buildAWSSimpleSystemsManagementClient(): AWSSimpleSystemsManagement =
    AWSSimpleSystemsManagementClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()
}
