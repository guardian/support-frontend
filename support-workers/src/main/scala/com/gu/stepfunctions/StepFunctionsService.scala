package com.gu.stepfunctions

import com.amazonaws.regions.Regions
import com.amazonaws.services.stepfunctions.AWSStepFunctionsAsyncClientBuilder
import com.amazonaws.services.stepfunctions.model.{DescribeExecutionResult, ExecutionListItem, StateMachineListItem}
import com.gu.aws.CredentialsProvider
import com.gu.config.Configuration.stage
import com.gu.monitoring.SafeLogger
import com.gu.support.config.Stages
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.User
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.states.CreatePaymentMethodState
import io.circe.generic.auto._

import scala.jdk.CollectionConverters._
import scala.concurrent.{ExecutionContext, Future}

class StepFunctionsService {
  private val prefix =
    if (stage == Stages.DEV)
      s"MonthlyContributions${Stages.CODE.toString}-" // There is no DEV state machine
    else
      s"MonthlyContributions${stage.toString}-"

  private val client = new ClientWrapper(
    AWSStepFunctionsAsyncClientBuilder.standard
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build(),
  )

  def findUserData(userId: String)(implicit ec: ExecutionContext): Future[Option[User]] =
    getStateMachines()
      .flatMap(sm => findUserDataInStateMachine(userId, sm.head.getStateMachineArn))

  private[stepfunctions] def getStateMachines()(implicit ec: ExecutionContext): Future[List[StateMachineListItem]] =
    client.listStateMachines.map { response =>
      response.getStateMachines.asScala.toList
        .filter(_.getName.startsWith(prefix))
    }

  private def findUserDataInStateMachine(userId: String, arn: String, nextToken: Option[String] = None)(implicit
      ec: ExecutionContext,
  ): Future[Option[User]] = {
    SafeLogger.info(s"Searching for user in statemachine $arn, nextToken: ${nextToken.getOrElse("")}")

    for {
      response <- client.listExecutions(arn, nextToken)
      maybeUser <- findUserDataInExecutions(userId, response.getExecutions.asScala.toList)
      // scalastyle:off null
      result <-
        if (maybeUser.isDefined || response.getNextToken == null)
          Future.successful(maybeUser)
        else
          findUserDataInStateMachine(userId, arn, Some(response.getNextToken)) // Hold on to your hats!

    } yield result
  }

  private def findUserDataInExecutions(userId: String, executions: List[ExecutionListItem])(implicit
      ec: ExecutionContext,
  ): Future[Option[User]] =
    Future
      .sequence(executions.map(findUserDataInExecution(userId, _)))
      .map(l => l.find(_.isDefined).flatten)

  private def findUserDataInExecution(userId: String, executionListItem: ExecutionListItem)(implicit
      ec: ExecutionContext,
  ): Future[Option[User]] =
    client
      .describeExecution(executionListItem.getExecutionArn)
      .map(decodeInput)
      .map(_.filter(_.id == userId))

  private def decodeInput(execution: DescribeExecutionResult): Option[User] =
    Encoding
      .in[CreatePaymentMethodState](execution.getInput.asInputStream)
      .map(_._1.user)
      .toOption

}
