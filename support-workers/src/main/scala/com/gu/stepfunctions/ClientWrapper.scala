package com.gu.stepfunctions

import com.amazonaws.services.stepfunctions.AWSStepFunctionsAsync
import com.amazonaws.services.stepfunctions.model._
import com.google.common.util.concurrent.RateLimiter
import com.gu.aws.AwsAsync

import scala.concurrent.Future

class ClientWrapper(client: AWSStepFunctionsAsync) {
  private val rateLimiter =
    RateLimiter.create(2d) // Limit the number of requests we make to avoid throttling exceptions

  def listStateMachines: Future[ListStateMachinesResult] = {
    rateLimiter.acquire
    AwsAsync(client.listStateMachinesAsync, new ListStateMachinesRequest())
  }

  def listExecutions(arn: String, nextToken: Option[String]): Future[ListExecutionsResult] = {
    val param = nextToken
      .map(new ListExecutionsRequest().withNextToken(_))
      .getOrElse(new ListExecutionsRequest())

    rateLimiter.acquire
    AwsAsync(client.listExecutionsAsync, param.withStateMachineArn(arn))
  }

  def describeExecution(executionArn: String): Future[DescribeExecutionResult] = {
    rateLimiter.acquire
    AwsAsync(client.describeExecutionAsync, new DescribeExecutionRequest().withExecutionArn(executionArn))
  }

}
