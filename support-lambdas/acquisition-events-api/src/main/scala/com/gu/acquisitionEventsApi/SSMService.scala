package com.gu.acquisitionEventsApi

import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import com.amazonaws.services.simplesystemsmanagement.{AWSSimpleSystemsManagement, AWSSimpleSystemsManagementClientBuilder}
import scala.jdk.CollectionConverters.CollectionHasAsScala
import com.gu.support.acquisitions.BigQueryConfig

object SSMService {
    // private val credentialsProvider = new AWSCredentialsProviderChain(
    //   new ProfileCredentialsProvider("membership")
    // )
  val client = AWSSimpleSystemsManagementClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1)
    .build()

  def getConfig(): Option[BigQueryConfig] = {
    val request = new GetParametersByPathRequest()
      .withPath(s"/acquisition-events-api/bigquery-config/CODE/")
      .withWithDecryption(true)
      .withRecursive(false)

    val result = client.getParametersByPath(request)
    val params = result.getParameters.asScala.toList.map{parameter =>
      parameter.getName -> parameter.getValue
    }.toMap

    for {
      projectId <- params.get("projectId")
      clientId <- params.get("clientId")
      clientEmail <- params.get("clientEmail")
      privateKey <- params.get("privateKey")
      privateKeyId <- params.get("privateKeyId")
    } yield BigQueryConfig(
      projectId, clientId, clientEmail, privateKey, privateKeyId
    )
  }

}
