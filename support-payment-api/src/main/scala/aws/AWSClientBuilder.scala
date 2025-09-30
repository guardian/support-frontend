package aws

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.Regions
import com.amazonaws.services.cloudwatch.{AmazonCloudWatchAsync, AmazonCloudWatchAsyncClientBuilder}
import com.gu.aws.CredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.sqs.SqsAsyncClient
import software.amazon.awssdk.services.ssm.SsmClient

object AWSClientBuilder {

  private val credentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("membership"),
    new InstanceProfileCredentialsProvider(false),
  )

  def buildSsmClient(): SsmClient =
    SsmClient
      .builder()
      // I don't understand why I need to supply this explicitly here,
      // whereas I can run support-frontend locally fine without supplying this
      // or having it set in my environment
      .region(Region.EU_WEST_1)
      .credentialsProvider(CredentialsProvider)
      .build()

  def buildAmazonSQSAsyncClient(): SqsAsyncClient =
    SqsAsyncClient
      .builder()
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build()

  def buildCloudWatchAsyncClient(): AmazonCloudWatchAsync =
    AmazonCloudWatchAsyncClientBuilder
      .standard()
      .withCredentials(credentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

  def buildS3Client(): S3Client =
    S3Client
      .builder()
      .region(Region.EU_WEST_1)
      .credentialsProvider(CredentialsProvider)
      .build()
}
