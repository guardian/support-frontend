package com.gu.support.redemption.corporate

import java.util.concurrent.CompletionException

import com.gu.support.redemption.corporate.DynamoLookup.{DynamoBoolean, DynamoString, DynamoValue}
import com.gu.support.redemption.corporate.DynamoUpdate.DynamoFieldUpdate
import com.typesafe.scalalogging.LazyLogging
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, EnvironmentVariableCredentialsProvider, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, GetItemRequest, UpdateItemRequest}

import scala.jdk.CollectionConverters._
import scala.jdk.FutureConverters._
import scala.concurrent.{ExecutionContext, Future}

object DynamoTableAsync {

  val ProfileName = "membership"

  lazy val CredentialsProvider =  AwsCredentialsProviderChain.builder.credentialsProviders(
    ProfileCredentialsProvider.builder.profileName(ProfileName).build,
    InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
    EnvironmentVariableCredentialsProvider.create()
  ).build

  def apply(table: String, key: String)(implicit e: ExecutionContext): DynamoTableAsync = {
    val dynamoDBClient = DynamoDbAsyncClient.builder
      .credentialsProvider(CredentialsProvider)
      .region(Region.EU_WEST_1)
      .build
    new DynamoTableAsync(dynamoDBClient, table, key)
  }
}

object DynamoLookup {
  sealed trait DynamoValue
  case class DynamoBoolean(bool: Boolean) extends DynamoValue
  case class DynamoString(string: String) extends DynamoValue
}
trait DynamoLookup {
  def lookup(key: String): Future[Option[Map[String, DynamoValue]]]
}

object DynamoUpdate {
  case class DynamoFieldUpdate(attributeName: String, attributeValue: Boolean)
}
trait DynamoUpdate {
  def update(key: String, dynamoFieldUpdate: DynamoFieldUpdate): Future[Unit]
}

class DynamoTableAsync(
  dynamoDBAsyncClient: DynamoDbAsyncClient,
  table: String,
  primaryKeyName: String
)(implicit e: ExecutionContext) extends LazyLogging with DynamoLookup with DynamoUpdate {

  override def lookup(key: String): Future[Option[Map[String, DynamoValue]]] = {
    val getItemRequest = GetItemRequest.builder
      .tableName(table)
      .key(Map(primaryKeyName -> AttributeValue.builder.s(key).build).asJava)
      .build

    val eventualGetItemResponse = dynamoDBAsyncClient.getItem(getItemRequest).asScala.recoverWith {
      case cex: CompletionException => Future.failed(cex.getCause)
    }

    eventualGetItemResponse.map { getItemResponse =>
      val maybeAttributes = Some(getItemResponse).collect {
        case gir if gir.hasItem => gir.item.asScala.toMap
      }
      maybeAttributes.map(attributes =>
        attributes.flatMap {
          case (key, value) if value.bool != null => Some(key -> DynamoBoolean(value.bool))
          case (key, value) if value.s != null => Some(key -> DynamoString(value.s))
          case _ => None // don't need to handle others yet
        }
      )
    }
  }

  override def update(key: String, dynamoFieldUpdate: DynamoFieldUpdate): Future[Unit] = {
    val updateItemRequest = UpdateItemRequest.builder
      .tableName(table)
      .key(Map(primaryKeyName -> AttributeValue.builder.s(key).build).asJava)
      .conditionExpression(s"attribute_exists($primaryKeyName)")
      .updateExpression(s"""SET ${dynamoFieldUpdate.attributeName} = :${dynamoFieldUpdate.attributeName}""")
      .expressionAttributeValues(Map(
        ":" + dynamoFieldUpdate.attributeName -> AttributeValue.builder.bool(dynamoFieldUpdate.attributeValue).build
      ).asJava)
      .build

    val eventualUpdateItemResponse = dynamoDBAsyncClient.updateItem(updateItemRequest).asScala.recoverWith {
      case cex: CompletionException => Future.failed(cex.getCause)
    }

    eventualUpdateItemResponse.map(_ => ())
  }
}

trait DynamoTableAsyncProvider {
  def forUser(isTestUser: Boolean): DynamoTableAsync
}
