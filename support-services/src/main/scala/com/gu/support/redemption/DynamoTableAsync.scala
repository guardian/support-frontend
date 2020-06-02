package com.gu.support.redemption

import java.util.concurrent.CompletionException

import com.typesafe.scalalogging.LazyLogging
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, GetItemRequest, UpdateItemRequest}

import scala.collection.JavaConverters._
import scala.compat.java8.FutureConverters._
import scala.concurrent.{ExecutionContext, Future}

object DynamoTableAsync {

  val ProfileName = "membership"

  lazy val CredentialsProvider =  AwsCredentialsProviderChain.builder.credentialsProviders(
     ProfileCredentialsProvider.builder.profileName(ProfileName).build,
     InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build
  ).build

  def apply(table: String, key: String)(implicit e: ExecutionContext): DynamoTableAsync = {
    val dynamoDBClient = DynamoDbAsyncClient.builder
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build
    new DynamoTableAsync(dynamoDBClient, table, key)
  }
}
trait DynamoLookup {
  def lookup(value: String): Future[Option[Map[String, Boolean]]]
}

trait DynamoUpdate {
  def update(primaryKeyValue: String, updateName: String, updateValue: Boolean): Future[Unit]
}

class DynamoTableAsync(
  dynamoDBAsyncClient: DynamoDbAsyncClient,
  table: String,
  primaryKeyName: String
)(implicit e: ExecutionContext) extends LazyLogging with DynamoLookup with DynamoUpdate {

  override def lookup(primaryKeyValue: String): Future[Option[Map[String, Boolean]]] = {
    val getItemRequest = GetItemRequest.builder
      .tableName(table)
      .key(Map(primaryKeyName -> AttributeValue.builder.s(primaryKeyValue).build).asJava)
      .build

    val eventualGetItemResponse = dynamoDBAsyncClient.getItem(getItemRequest).toScala.recoverWith {
      case cex: CompletionException => Future.failed(cex.getCause)
    }

    eventualGetItemResponse.map { getItemResponse =>
      val maybeAttributes = Some(getItemResponse).collect {
        case gir if gir.hasItem => gir.item.asScala.toMap
      }
      maybeAttributes.map(attributes =>
        attributes.flatMap {
          // only need to handle boolean values at the moment
          case (key, value) => Option(value.bool).map(Boolean2boolean).map(bool => key -> bool)
        }
      )
    }
  }

  override def update(primaryKeyValue: String, updateName: String, updateValue: Boolean): Future[Unit] = {
    val updateItemRequest = UpdateItemRequest.builder
      .tableName(table)
      .key(Map(primaryKeyName -> AttributeValue.builder.s(primaryKeyValue).build).asJava)
      .conditionExpression(s"attribute_exists($primaryKeyName)")
      .updateExpression(s"""SET $updateName = :$updateName""")
      .expressionAttributeValues(Map(
        ":" + updateName -> AttributeValue.builder.bool(updateValue).build
      ).asJava)
      .build

    val eventualUpdateItemResponse = dynamoDBAsyncClient.updateItem(updateItemRequest).toScala.recoverWith {
      case cex: CompletionException => Future.failed(cex.getCause)
    }

    eventualUpdateItemResponse.map(_ => ())
  }
}
