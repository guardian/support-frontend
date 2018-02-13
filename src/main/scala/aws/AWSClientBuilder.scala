package aws

import com.amazonaws.auth.AWSCredentialsProviderChain
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.simplesystemsmanagement.{AWSSimpleSystemsManagement, AWSSimpleSystemsManagementClientBuilder}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

// lifecycle used to add stop hooks so AWS clients can be closed when application is shutdown.
class AWSClientBuilder(lifecycle: ApplicationLifecycle) {

  private val credentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("membership")
  )

  private def addStopHook[A](action: => Unit): Unit =
    lifecycle.addStopHook(() => Future.successful(action))

  def buildAWSSimpleSystemsManagementClient(): AWSSimpleSystemsManagement = {
    val client = AWSSimpleSystemsManagementClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .build()
    addStopHook(client.shutdown())
    client
  }
}
