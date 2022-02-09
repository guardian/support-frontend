package com.gu.support.promotions.dynamo

import cats.syntax.either._
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.document.{DynamoDB, Item, Table}
import com.typesafe.scalalogging.LazyLogging
import io.circe.Decoder
import io.circe.parser._

import scala.collection.JavaConverters._

class DynamoService[T](table: Table)(implicit decoder: Decoder[T]) extends LazyLogging {
  def all: Iterator[T] = {
    val items: Iterator[Item] = table.scan().iterator().asScala
    items.flatMap { item =>
      val result = decode[T](item.toJSON)
      result.leftMap(err => logger.warn(s"Couldn't decode a PromoCode with body ${item.toJSON}. Error was: $err"))
      result.toOption
    }
  }
}

object DynamoService {
  val ProfileName = "membership"

  lazy val CredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
  )

  def forTable[T](table: String)(implicit decoder: Decoder[T]): DynamoService[T] = {
    val dynamoDBClient = AmazonDynamoDBClient.builder
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()
    new DynamoService(new DynamoDB(dynamoDBClient).getTable(table))
  }
}
