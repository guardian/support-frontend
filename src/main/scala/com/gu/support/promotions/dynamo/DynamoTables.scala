package com.gu.support.promotions.dynamo

import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.document.{DynamoDB, Table}
import com.gu.support.config.TouchPointEnvironment
import com.typesafe.config.Config

object DynamoTables {

  val ProfileName = "membership"

  lazy val CredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false)
  )

  private def getTable[T](table: String) = {
    val dynamoDBClient = AmazonDynamoDBClient.builder
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()
    new DynamoDB(dynamoDBClient).getTable(table)
  }

  def promotions(config: Config, environment: TouchPointEnvironment): Table =
    getTable(config.getString(s"touchpoint.backend.environments.$environment.dynamodb.promotions"))

  def campaigns(config: Config, environment: TouchPointEnvironment): Table =
    getTable(config.getString(s"touchpoint.backend.environments.$environment.dynamodb.campaigns"))

}
