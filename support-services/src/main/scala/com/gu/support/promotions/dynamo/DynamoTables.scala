package com.gu.support.promotions.dynamo

import com.gu.aws.CredentialsProviderDEPRECATEDV1
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.document.{DynamoDB, Table}

object DynamoTables {

  def getTable[T](table: String): Table = {
    val dynamoDBClient = AmazonDynamoDBClient.builder
      .withCredentials(CredentialsProviderDEPRECATEDV1)
      .withRegion(Regions.EU_WEST_1)
      .build()
    new DynamoDB(dynamoDBClient).getTable(table)
  }
}
