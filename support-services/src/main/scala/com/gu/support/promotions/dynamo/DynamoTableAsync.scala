package com.gu.support.promotions.dynamo

import java.util.concurrent.{Future => JFuture}

import com.amazonaws.AmazonWebServiceRequest
import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.model._
import com.amazonaws.services.dynamodbv2.{AmazonDynamoDBAsync, AmazonDynamoDBAsyncClient}
import com.typesafe.scalalogging.LazyLogging

import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future, Promise}

object DynamoTableAsync {
  def apply(table: String, key: String)(implicit e: ExecutionContext): DynamoTableAsync = {
    val dynamoDBClient = AmazonDynamoDBAsyncClient.asyncBuilder
      .withCredentials(DynamoService.CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()
    new DynamoTableAsync(dynamoDBClient, table, key)
  }
}
trait DynamoLookup {
  def lookup(value: String): Future[Option[Map[String, AttributeValue]]]
}

trait DynamoUpdate {
  def update(primaryKeyValue: String, updateName: String, updateValue: Boolean): Future[Unit]
}

class DynamoTableAsync(
  dynamoDBAsyncClient: AmazonDynamoDBAsync,
  table: String,
  primaryKeyName: String
)(implicit e: ExecutionContext) extends LazyLogging with DynamoLookup with DynamoUpdate {

  override def lookup(primaryKeyValue: String): Future[Option[Map[String, AttributeValue]]] = {
    val getItemRequest = new GetItemRequest(table, Map(primaryKeyName -> new AttributeValue(primaryKeyValue)).asJava)
    AwsAsync[GetItemRequest, GetItemResult](
      dynamoDBAsyncClient.getItemAsync,
      getItemRequest
    ).map { gIR =>
      Option(gIR.getItem).map(_.asScala.toMap)
    }
  }

  override def update(primaryKeyValue: String, updateName: String, updateValue: Boolean): Future[Unit] =
    AwsAsync[UpdateItemRequest, UpdateItemResult](
      dynamoDBAsyncClient.updateItemAsync,
      new UpdateItemRequest(
        table,
        Map(primaryKeyName -> new AttributeValue(primaryKeyValue)).asJava,
        Map(updateName -> new AttributeValueUpdate(new AttributeValue().withBOOL(updateValue), AttributeAction.PUT)).asJava
      )
    ).map(_ => ())
}

class AwsAsyncHandler[Request <: AmazonWebServiceRequest, Response] extends AsyncHandler[Request, Response] {
  private val promise = Promise[Response]()

  override def onError(exception: Exception): Unit = promise.failure(exception)

  override def onSuccess(request: Request, result: Response): Unit = promise.success(result)

  def future: Future[Response] = promise.future
}

object AwsAsync {

  def apply[Request <: AmazonWebServiceRequest, Response](
    f: (Request, AsyncHandler[Request, Response]) => JFuture[Response],
    request: Request
  )(implicit e: ExecutionContext): Future[Response] = {
    val handler = new AwsAsyncHandler[Request, Response]
    try {
      f(request, handler)
      handler.future.recoverWith { case e => Future.failed(new RuntimeException(s"aws call failed for $request: ${e.toString}", e)) }
    } catch {
      case e: Throwable => Future.failed(new RuntimeException(s"aws call failed for $request: ${e.toString}", e))
    }
  }
}
