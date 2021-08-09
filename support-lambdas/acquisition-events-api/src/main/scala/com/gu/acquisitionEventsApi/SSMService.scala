package com.gu.acquisitionEventsApi

import cats.syntax.either._
import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import com.amazonaws.services.simplesystemsmanagement.{AWSSimpleSystemsManagement, AWSSimpleSystemsManagementClientBuilder}

import scala.jdk.CollectionConverters.CollectionHasAsScala
import com.gu.support.acquisitions.BigQueryConfig

import scala.util.Try

object SSMService {
    // private val credentialsProvider = new AWSCredentialsProviderChain(
    //   new ProfileCredentialsProvider("membership")
    // )
  val client = AWSSimpleSystemsManagementClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1)
    .build()

  def getConfig(): Either[String, BigQueryConfig] = {
    val request = new GetParametersByPathRequest()
      .withPath(s"/acquisition-events-api/bigquery-config/CODE/")
      .withWithDecryption(true)
      .withRecursive(false)

    Try(client.getParametersByPath(request))
      .toEither
      .leftMap(error => error.getMessage)
      .flatMap {result =>
        val params = result.getParameters.asScala.toList.map{parameter =>
          parameter.getName -> parameter.getValue
        }.toMap

        val config = for {
          projectId <- params.get("projectId")
          clientId <- params.get("clientId")
          clientEmail <- params.get("clientEmail")
          privateKey <- params.get("privateKey")
          privateKeyId <- params.get("privateKeyId")
        } yield BigQueryConfig(
          projectId, clientId, clientEmail, privateKey, privateKeyId
        )

        config match {
          case Some(value) => Right(value)
          case None => Left("Failed: one or more parameters are missing")
        }
      }

  }

}
