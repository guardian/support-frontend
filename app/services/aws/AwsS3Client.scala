package services.aws

import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.{AmazonS3, AmazonS3Client, AmazonS3ClientBuilder}
import com.amazonaws.services.s3.model.{GetObjectRequest, S3ObjectInputStream}
import services.aws
import play.api.libs.json.{JsValue, Json}
import scala.util.{Failure, Success, Try}
import scala.io.Source

object AwsS3Client {
  implicit val s3: AmazonS3 =
    AmazonS3ClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(aws.CredentialsProvider)
      .build()

  def fetchObject(s3Client: AmazonS3, request: GetObjectRequest): Try[S3ObjectInputStream] = Try(s3Client.getObject(request).getObjectContent)

  def fetchJson(s3Client: AmazonS3, request: GetObjectRequest): Option[JsValue] = {
    val attempt = for {
      s3Stream <- fetchObject(s3Client, request)
      json <- Try(Json.parse(Source.fromInputStream(s3Stream).mkString))
      _ <- Try(s3Stream.close())
    } yield json
    attempt match {
      case Success(json) => Some(json)
      case Failure(ex) => None
    }
  }
}
