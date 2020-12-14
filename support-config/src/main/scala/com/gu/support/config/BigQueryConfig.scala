package com.gu.support.config

import com.typesafe.config.Config

case class BigQueryConfig(
  projectId: String,
  clientId: String,
  clientEmail: String,
  privateKey: String,
  privateKeyId: String
) extends TouchpointConfig

class BigQueryConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[BigQueryConfig](config, defaultStage) {
  def fromConfig(config: Config): BigQueryConfig = {
    BigQueryConfig(
      config.getString("google.gcp.bigquery.credentials.projectId"),
      config.getString("google.gcp.bigquery.credentials.clientId"),
      config.getString("google.gcp.bigquery.credentials.clientEmail"),
      config.getString("google.gcp.bigquery.credentials.privateKey"),
      config.getString("google.gcp.bigquery.credentials.privateKeyId")
    )
  }
}
