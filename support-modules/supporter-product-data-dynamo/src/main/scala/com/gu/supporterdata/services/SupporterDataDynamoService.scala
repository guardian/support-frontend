package com.gu.supporterdata.services

import com.gu.aws.ProfileName
import com.gu.supporterdata.model.FieldNames._
import com.gu.supporterdata.model.{Stage, SupporterRatePlanItem}
import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  EnvironmentVariableCredentialsProvider,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider,
}
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration
import software.amazon.awssdk.core.retry.RetryPolicy
import software.amazon.awssdk.core.retry.backoff.FullJitterBackoffStrategy
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient
import software.amazon.awssdk.services.dynamodb.model._

import java.time.format.DateTimeFormatter
import java.time.{Duration, LocalDate, ZoneOffset}
import scala.compat.java8.FutureConverters._
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._
import scala.util.{Failure, Success, Try}

class SupporterDataDynamoService(client: DynamoDbAsyncClient, tableName: String) {

  def cancelSubscription(
      identityIdToCancel: String,
      subscriptionId: String,
      cancellationDate: LocalDate,
  )(implicit executionContext: ExecutionContext): Future[Either[String, UpdateItemResponse]] = {
    val key = Map(
      identityIdField -> AttributeValue.builder.s(identityIdToCancel).build,
      subscriptionNameField -> AttributeValue.builder.s(subscriptionId).build,
    ).asJava

    val updateExpression =
      s"SET $cancellationDateField = :$cancellationDateField"

    val values = Map(
      ":" + cancellationDateField -> AttributeValue.builder.s(asIso(cancellationDate)).build,
    )

    val updateItemRequest = UpdateItemRequest.builder
      .tableName(tableName)
      .key(key)
      .updateExpression(updateExpression)
      .expressionAttributeValues(values.asJava)
      .build

    client.updateItem(updateItemRequest).toScala.transform {
      case Success(value) => Try(Right(value))
      case Failure(exception) => Try(Left(exception.getMessage))
    }
  }

  def writeItem(
      item: SupporterRatePlanItem,
  )(implicit executionContext: ExecutionContext): Future[UpdateItemResponse] = {
    val beneficiaryIdentityId = item.gifteeIdentityId.getOrElse(item.identityId)

    // Dynamo will delete expired subs at the start of the day, whereas the subscription actually lasts until the end of the day
    val expiryDate = item.termEndDate.plusDays(1)

    val key = Map(
      identityIdField -> AttributeValue.builder.s(beneficiaryIdentityId).build,
      subscriptionNameField -> AttributeValue.builder.s(item.subscriptionName).build,
    ).asJava

    val requiredValuesExpression =
      s"""SET
          $productRatePlanIdField = :$productRatePlanIdField,
          $productRatePlanNameField = :$productRatePlanNameField,
          $termEndDateField = :$termEndDateField,
          $contractEffectiveDateField = :$contractEffectiveDateField,
          $expiryDateNameField = :$expiryDateNameField
          """
    val updateExpression =
      if (item.contributionAmount.isDefined)
        requiredValuesExpression + s""",
          $contributionAmountField = :$contributionAmountField,
          $contributionCurrencyField = :$contributionCurrencyField
        """
      else requiredValuesExpression

    val requiredValues = Map(
      ":" + productRatePlanIdField -> AttributeValue.builder.s(item.productRatePlanId).build,
      ":" + productRatePlanNameField -> AttributeValue.builder.s(item.productRatePlanName).build,
      ":" + termEndDateField -> AttributeValue.builder.s(asIso(item.termEndDate)).build,
      ":" + contractEffectiveDateField -> AttributeValue.builder.s(asIso(item.contractEffectiveDate)).build,
      ":" + expiryDateNameField -> AttributeValue.builder.n(asEpochSecond(expiryDate)).build,
    )

    val attributeValues = item.contributionAmount
      .map(amount =>
        requiredValues ++ Map(
          ":" + contributionAmountField -> AttributeValue.builder.n(amount.amount.toString).build,
          ":" + contributionCurrencyField -> AttributeValue.builder.s(amount.currency).build,
        ),
      )
      .getOrElse(requiredValues)

    val updateItemRequest = UpdateItemRequest.builder
      .tableName(tableName)
      .key(key)
      .updateExpression(updateExpression)
      .expressionAttributeValues(attributeValues.asJava)
      .build

    client.updateItem(updateItemRequest).toScala
  }

  def asEpochSecond(date: LocalDate) =
    date.atStartOfDay
      .toEpochSecond(ZoneOffset.UTC)
      .toString

  def asIso(date: LocalDate) =
    date.format(DateTimeFormatter.ISO_LOCAL_DATE)
}

object SupporterDataDynamoService {
  lazy val CredentialsProvider = AwsCredentialsProviderChain.builder
    .credentialsProviders(
      ProfileCredentialsProvider.builder.profileName(ProfileName).build,
      InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
      EnvironmentVariableCredentialsProvider.create(),
    )
    .build

  val clientOverrideConfiguration = ClientOverrideConfiguration.builder
    .retryPolicy(
      RetryPolicy
        .defaultRetryPolicy()
        .toBuilder
        .numRetries(20)
        .backoffStrategy(
          FullJitterBackoffStrategy.builder
            .baseDelay(Duration.ofMillis(500))
            .maxBackoffTime(Duration.ofSeconds(4))
            .build(),
        )
        .build(),
    )
    .build

  val dynamoDBClient = DynamoDbAsyncClient.builder
    .overrideConfiguration(
      clientOverrideConfiguration,
    )
    .credentialsProvider(CredentialsProvider)
    .region(Region.EU_WEST_1)
    .build

  def apply(stage: Stage) = new SupporterDataDynamoService(dynamoDBClient, s"SupporterProductData-${stage.value}")
}
