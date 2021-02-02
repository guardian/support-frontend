package com.gu.conf

import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementAsyncClientBuilder
import com.amazonaws.services.simplesystemsmanagement.model.{GetParametersByPathRequest, Parameter}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.model.Stage

import scala.concurrent.ExecutionContext.Implicits.global
import scala.collection.JavaConverters._
import scala.concurrent.Future

case class ZuoraQuerierConfig(
  url: String,
  partnerId: String,
  username: String,
  password: String,
  discountProductRatePlanIds: List[String]
)

object ZuoraQuerierConfig {
  lazy val client = AWSSimpleSystemsManagementAsyncClientBuilder.standard()
    .withRegion(Regions.EU_WEST_1)
    .withCredentials(CredentialsProvider)
    .build()

  def load(stage: Stage): Future[ZuoraQuerierConfig] = {
    val configPath = s"/supporter-product-data/${stage.value}/zuora-config/"

    getParametersByPath(configPath).map {
      params =>
        ZuoraQuerierConfig(
          getParameterValue(configPath, "url", params),
          getParameterValue(configPath, "partnerId", params),
          getParameterValue(configPath, "username", params),
          getParameterValue(configPath, "password", params),
          getParameterValue(configPath, "discountProductRatePlanIds", params).split(',').toList,
        )
    }
  }

  private def getParameterValue(configPath: String, name: String, params: List[Parameter]) =
    params
      .find(_.getName == configPath + name)
      .map(_.getValue)
      .toRight(
        new RuntimeException(s"Missing config value for parameter $name in ZuoraQuerierConfig")
      ).toTry.get

  private def getParametersByPath(path: String) = {
    val request: GetParametersByPathRequest = new GetParametersByPathRequest()
      .withPath(path)
      .withRecursive(false)
      .withWithDecryption(true)

    AwsAsync(client.getParametersByPathAsync, request).map(_.getParameters.asScala.toList)
  }

}
