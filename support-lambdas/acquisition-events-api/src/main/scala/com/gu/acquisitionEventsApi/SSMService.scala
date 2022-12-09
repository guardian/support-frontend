package com.gu.acquisitionEventsApi

import cats.syntax.either._
import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider,
}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.ssm.SsmClient
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest
import com.gu.support.acquisitions.BigQueryConfig

import scala.jdk.CollectionConverters.CollectionHasAsScala
import scala.util.Try

object SSMService {
  private val stage = sys.env.getOrElse("STAGE", "CODE")

  private val credentialsProvider = AwsCredentialsProviderChain
    .builder()
    .credentialsProviders(
      ProfileCredentialsProvider.builder.profileName("membership").build,
      InstanceProfileCredentialsProvider.builder
        .asyncCredentialUpdateEnabled(true)
        .build,
      EnvironmentVariableCredentialsProvider.create(),
    )

  private val client = SsmClient
    .builder()
    .credentialsProvider(credentialsProvider.build())
    .region(Region.EU_WEST_1)
    .build()

  def getConfig(): Either[String, BigQueryConfig] = {
    val path = s"/acquisition-events-api/bigquery-config/$stage"
    val request = GetParametersByPathRequest
      .builder()
      .path(path + "/")
      .withDecryption(true)
      .recursive(false)
      .build()

    Try(client.getParametersByPath(request)).toEither
      .leftMap(error => error.getMessage)
      .flatMap { result =>
        val params = result.parameters.asScala.toList.map { parameter =>
          parameter.name -> parameter.value
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
