package com.gu.acquisitions

import com.gu.support.acquisitions.BigQueryConfig
import com.gu.support.config.{Stage, TouchpointConfigProvider}
import com.typesafe.config.Config

class BigQueryConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[BigQueryConfig](config, defaultStage) {
  def fromConfig(config: Config): BigQueryConfig = {
    BigQueryConfig(
      config.getString("google.gcp.bigquery.credentials.projectId"),
      config.getString("google.gcp.bigquery.credentials.clientId"),
      config.getString("google.gcp.bigquery.credentials.clientEmail"),
      config.getString("google.gcp.bigquery.credentials.privateKey"),
      config.getString("google.gcp.bigquery.credentials.privateKeyId"),
    )
  }
}
