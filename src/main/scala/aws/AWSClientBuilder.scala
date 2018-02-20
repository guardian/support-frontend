package aws

import com.amazonaws.auth.AWSCredentialsProviderChain
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.simplesystemsmanagement.{AWSSimpleSystemsManagement, AWSSimpleSystemsManagementClientBuilder}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

// lifecycle used to add stop hooks so AWS clients can be closed when application is shutdown.
object AWSClientBuilder {

  private val credentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("membership")
  )

  def buildAWSSimpleSystemsManagementClient(): AWSSimpleSystemsManagement =
    AWSSimpleSystemsManagementClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .build()
}
