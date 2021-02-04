package com.gu.conf

import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementAsyncClientBuilder
import com.amazonaws.services.simplesystemsmanagement.model.{GetParametersByPathRequest, Parameter}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.model.Stage
import com.gu.model.Stage.{DEV, PROD, UAT}

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
          getDiscountProductRatePlanIds(stage),
        )
    }
  }

  private def getDiscountProductRatePlanIds(stage: Stage) =
    stage match {
      case DEV => List("2c92c0f852f2ebb20152f9269f067819")
      case UAT => List("2c92c0f953078a5601531299dae54a4d")
      case PROD => List(
        "2c92a00d6f9de7f6016f9f6f52765aa4",
        "2c92a0076ae9189c016b080c930a6186",
        "2c92a0ff5345f9220153559d915d5c26",
        "2c92a0fe7375d60901737c64808e4be1",
        "2c92a0fe750b35d001750d4522f43817",
        "2c92a00f7468817d01748bd88f0d1d6c",
        "2c92a0117468816901748bdb3a8c1ac4"
      )
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
