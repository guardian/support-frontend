package aws

import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.{AWSSimpleSystemsManagement, AWSSimpleSystemsManagementClientBuilder}
import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.{AmazonSQSAsync, AmazonSQSAsyncClientBuilder}

object AWSClientBuilder {

  private val credentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("membership"),
    new InstanceProfileCredentialsProvider(false)
  )

  def buildAWSSimpleSystemsManagementClient(): AWSSimpleSystemsManagement =
    AWSSimpleSystemsManagementClientBuilder
      .standard()
      // I don't understand why I need to supply this explicitly here,
      // whereas I can run support-frontend locally fine without supplying this
      // or having it set in my environment
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(credentialsProvider)
      .build()

  def buildAmazonSQSAsyncClientBuilder(queueName: String): AmazonSQSAsync =
    AmazonSQSAsyncClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

}
