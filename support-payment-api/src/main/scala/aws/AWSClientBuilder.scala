package aws

import com.gu.aws.CredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.sqs.SqsAsyncClient
import software.amazon.awssdk.services.ssm.SsmClient

object AWSClientBuilder {
  def buildSsmClient(): SsmClient =
    SsmClient
      .builder()
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build()

  def buildAmazonSQSAsyncClient(): SqsAsyncClient =
    SqsAsyncClient
      .builder()
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build()

  def buildCloudWatchAsyncClient(): CloudWatchAsyncClient =
    CloudWatchAsyncClient
      .builder()
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build()

  def buildS3Client(): S3Client =
    S3Client
      .builder()
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build()
}
