package services.stepfunctions

import services.aws.AwsAsync
import StateMachineContainer.{Response, convertErrors}
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.regions.Regions
import services.aws.CredentialsProvider
import com.amazonaws.services.stepfunctions.model._
import com.amazonaws.services.stepfunctions.{AWSStepFunctionsAsync, AWSStepFunctionsAsyncClientBuilder}
import io.circe.Encoder
import cats.implicits._
import services.stepfunctions.StateMachineErrors.Fail

import scala.collection.JavaConversions._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext
import codecs.CirceDecoders._

object Client {
  def apply(arn: String)(implicit system: ActorSystem): Client = {
    implicit val ec = system.dispatcher

    val client = AWSStepFunctionsAsyncClientBuilder.standard
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

    new Client(client, arn)
  }
}

class Client(client: AWSStepFunctionsAsync, arn: String) {

  private def startExecution(arn: String, input: String)(implicit ec: ExecutionContext): Response[StartExecutionResult] = convertErrors {
    AwsAsync(client.startExecutionAsync, new StartExecutionRequest().withStateMachineArn(arn).withInput(input))
  }

  def triggerExecution[T](input: T, isTestUser: Boolean)(
    implicit
    ec: ExecutionContext,
    encoder: Encoder[T],
    stateWrapper: StateWrapper
  ): Response[StateMachineExecution] = {
    startExecution(arn, stateWrapper.wrap(input, isTestUser))
      .map(StateMachineExecution.fromStartExecution)
  }

  def jobIdFromArn(arn: String): Option[String] = {
    PartialFunction.condOpt(arn.split(':').toList) {
      case "arn" :: "aws" :: "states" :: region :: accountId :: "execution" :: stateMachine :: executionId :: Nil =>
        executionId
    }
  }

  def arnFromJobId(jobId: String): String = s"$arn:$jobId"

  def statusFromEvents(events: List[HistoryEvent]): Option[ExecutionStatus] =
    events.view.map(_.getType).collectFirst(ExecutionStatus.all)

  def history(jobId: String)(implicit ec: ExecutionContext, stateWrapper: StateWrapper): Response[List[HistoryEvent]] = {
    toEither(
      AwsAsync(client.getExecutionHistoryAsync, new GetExecutionHistoryRequest().withExecutionArn(arnFromJobId(jobId)).withReverseOrder(true))
    ).map(_.getEvents.toList)
  }

  private def toEither[T](result: Future[T])(implicit ec: ExecutionContext): Response[T] = EitherT {
    result.map(_.asRight[StateMachineError]).recover {
      case _: AWSStepFunctionsException => Fail.asLeft
    }
  }
}
