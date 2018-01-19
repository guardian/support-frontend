package com.gu.stepfunctions

import com.amazonaws.services.stepfunctions.AWSStepFunctionsAsync
import com.amazonaws.services.stepfunctions.model._
import com.gu.aws.AwsAsync

import scala.concurrent.Future

class ClientWrapper(client: AWSStepFunctionsAsync) {
  def listStateMachines: Future[ListStateMachinesResult] =
    AwsAsync(client.listStateMachinesAsync, new ListStateMachinesRequest())

  def listExecutions(arn: String, nextToken: Option[String]): Future[ListExecutionsResult] = {
    val param = nextToken
      .map(new ListExecutionsRequest().withNextToken(_))
      .getOrElse(new ListExecutionsRequest())

    AwsAsync(client.listExecutionsAsync, param.withStateMachineArn(arn))
  }

  def describeExecution(executionArn: String): Future[DescribeExecutionResult] =
    AwsAsync(client.describeExecutionAsync, new DescribeExecutionRequest().withExecutionArn(executionArn))

}
