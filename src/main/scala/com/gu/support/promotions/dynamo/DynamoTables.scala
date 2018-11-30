package com.gu.support.promotions.dynamo

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.document.{DynamoDB, Table}

object DynamoTables {

  val ProfileName = "membership"

  lazy val CredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false)
  )

  def getTable[T](table: String): Table = {
    val dynamoDBClient = AmazonDynamoDBClient.builder
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()
    new DynamoDB(dynamoDBClient).getTable(table)
  }
}
