package com.gu.acquisitionEventsApi

import cats.syntax.either._
import com.amazonaws.regions.Regions
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementClientBuilder
import scala.jdk.CollectionConverters.CollectionHasAsScala
import com.gu.support.acquisitions.BigQueryConfig
import scala.util.Try

object SSMService {
  private val stage = sys.env.getOrElse("STAGE", "CODE")

  val client = AWSSimpleSystemsManagementClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1)
    .build()

  def getConfig(): Either[String, BigQueryConfig] = {
    val path = s"/acquisition-events-api/bigquery-config/$stage"
    val request = new GetParametersByPathRequest()
      .withPath(path + "/")
      .withWithDecryption(true)
      .withRecursive(false)

    Try(client.getParametersByPath(request)).toEither
      .leftMap(error => error.getMessage)
      .flatMap { result =>
        val params = result.getParameters.asScala.toList.map { parameter =>
          parameter.getName -> parameter.getValue
        }.toMap

        val config = for {
          projectId <- params.get(s"$path/projectId")
          clientId <- params.get(s"$path/clientId")
          clientEmail <- params.get(s"$path/clientEmail")
          privateKey <- params.get(s"$path/privateKey")
          privateKeyId <- params.get(s"$path/privateKeyId")
        } yield BigQueryConfig(
          projectId,
          clientId,
          clientEmail,
          privateKey,
          privateKeyId,
        )

        config match {
          case Some(value) => Right(value)
          case None => Left("Failed: one or more parameters are missing")
        }
      }

  }

}
