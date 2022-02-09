package aws

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.Regions
import com.amazonaws.services.cloudwatch.{AmazonCloudWatchAsync, AmazonCloudWatchAsyncClientBuilder}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.amazonaws.services.simplesystemsmanagement.{
  AWSSimpleSystemsManagement,
  AWSSimpleSystemsManagementClientBuilder,
}
import com.amazonaws.services.sqs.{AmazonSQSAsync, AmazonSQSAsyncClientBuilder}

object AWSClientBuilder {

  private val credentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("membership"),
    new InstanceProfileCredentialsProvider(false),
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

  def buildAmazonSQSAsyncClient(): AmazonSQSAsync =
    AmazonSQSAsyncClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

  def buildCloudWatchAsyncClient(): AmazonCloudWatchAsync =
    AmazonCloudWatchAsyncClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

  def buildS3Client(): AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(credentialsProvider)
    .build()
}
