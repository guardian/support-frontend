package services.aws

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import services.aws

object AwsS3Client {
  implicit val s3: AmazonS3 =
    AmazonS3ClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(aws.CredentialsProvider)
      .build()
}
