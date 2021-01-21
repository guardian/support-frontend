package com.gu.services

import com.gu.aws.ProfileName
import com.gu.model.dynamo.{AttributeNames, SupporterRatePlanItem}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, EnvironmentVariableCredentialsProvider, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, UpdateItemRequest}

import java.time.format.DateTimeFormatter
import scala.collection.JavaConverters._
import scala.compat.java8.FutureConverters._
import java.util.concurrent.CompletionException
import scala.concurrent.{ExecutionContext, Future}


class DynamoDBService(client: DynamoDbAsyncClient, tableName: String) {

  def writeItem(item: SupporterRatePlanItem)(implicit executionContext: ExecutionContext) = {
    val key = Map(
      AttributeNames.identityId -> AttributeValue.builder.s(item.identityId).build,
      AttributeNames.ratePlanId -> AttributeValue.builder.s(item.ratePlanId).build
    ).asJava

    val updateExpression =
      s"""SET
          ${AttributeNames.productRatePlanId} = :${AttributeNames.productRatePlanId},
          ${AttributeNames.ratePlanName} = :${AttributeNames.ratePlanName},
          ${AttributeNames.termEndDate} = :${AttributeNames.termEndDate}
          """
    val attributeValues = Map(
      ":" + AttributeNames.productRatePlanId -> AttributeValue.builder.s(item.productRatePlanId).build,
      ":" + AttributeNames.ratePlanName -> AttributeValue.builder.s(item.ratePlanName).build,
      ":" + AttributeNames.termEndDate -> AttributeValue.builder.s(item.termEndDate.format(DateTimeFormatter.ISO_DATE)).build,
    ).asJava

    val updateItemRequest = UpdateItemRequest.builder
      .tableName(tableName)
      .key(key)
      .updateExpression(updateExpression)
      .expressionAttributeValues(attributeValues)
      .build

    val eventualUpdateItemResponse = client.updateItem(updateItemRequest).toScala.recoverWith {
      case cex: CompletionException => Future.failed(cex.getCause)
    }

    eventualUpdateItemResponse.map(_ => ())
  }
}

object DynamoDBService{
  lazy val CredentialsProvider = AwsCredentialsProviderChain.builder.credentialsProviders(
    ProfileCredentialsProvider.builder.profileName(ProfileName).build,
    InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
    EnvironmentVariableCredentialsProvider.create()
  ).build

  val dynamoDBClient = DynamoDbAsyncClient.builder
    .credentialsProvider(CredentialsProvider)
    .region(Region.EU_WEST_1)
    .build

  def apply(stage: String) = new DynamoDBService(dynamoDBClient, s"SupporterProductData-$stage")
}
