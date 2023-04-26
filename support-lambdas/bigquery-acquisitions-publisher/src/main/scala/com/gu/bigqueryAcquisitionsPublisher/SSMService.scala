package com.gu.bigqueryAcquisitionsPublisher

import cats.syntax.either._
import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementClientBuilder
import com.amazonaws.services.simplesystemsmanagement.model.GetParameterRequest
import com.gu.aws.CredentialsProvider

import scala.util.Try

object SSMService {
  val client = AWSSimpleSystemsManagementClientBuilder
    .standard()
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  def getParam(path: String): Either[String, String] = {
    val request = new GetParameterRequest()
      .withName(path)
      .withWithDecryption(true)
    Try(client.getParameter(request)).toEither
      .leftMap(error => error.getMessage)
      .map(result => result.getParameter.getValue)
  }
}
