package com.gu.support.promotions.dynamo

import cats.syntax.either._
import com.gu.aws.CredentialsProvider
import com.typesafe.scalalogging.LazyLogging
import io.circe.Decoder
import io.circe.parser._
import software.amazon.awssdk.enhanced.dynamodb.{
  AttributeConverterProvider,
  DynamoDbEnhancedClient,
  DynamoDbTable,
  TableSchema,
}
import software.amazon.awssdk.enhanced.dynamodb.document.EnhancedDocument
import software.amazon.awssdk.enhanced.dynamodb.model.Page
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbClient

import scala.jdk.CollectionConverters._

class DynamoService[T](table: String)(implicit decoder: Decoder[T]) extends LazyLogging {

  val dynamoTable: DynamoDbTable[EnhancedDocument] = {
    val dynamoDBClient = DynamoDbClient.builder
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build()
    val enhancedClient = DynamoDbEnhancedClient
      .builder()
      .dynamoDbClient(dynamoDBClient)
      .build();
    val documentDynamoDbTable =
      enhancedClient.table(
        table,
        TableSchema
          .documentSchemaBuilder()
          .attributeConverterProviders(AttributeConverterProvider.defaultProvider())
          .build(),
      );
    documentDynamoDbTable
  }

  def all: Iterator[T] = {
    val pages: Iterator[Page[EnhancedDocument]] = dynamoTable.scan().iterator().asScala
    val items = pages.flatMap(_.items().asScala)
    val jsonItems = items.map(_.toJson)
    jsonItems.flatMap { json =>
      val result = decode[T](json)
      result.leftMap(err => logger.warn(s"Couldn't decode a PromoCode with body $json. Error was: $err"))
      result.toOption
    }
  }
}
