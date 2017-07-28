package services.stepfunctions

import services.aws.AwsAsync
import StateMachineContainer.{Response, convertErrors}
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.regions.Regions
import services.aws.CredentialsProvider
import services.aws.AccountId
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
  def apply(stateMachinePrefix: String)(implicit system: ActorSystem): Client = {
    implicit val ec = system.dispatcher

    val client = AWSStepFunctionsAsyncClientBuilder.standard
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

    val stateMachineLookup = StateMachineLookup(stateMachinePrefix)

    val stateMachineWrapper = new StateMachineContainer(() => stateMachineLookup.lookup(client))

    new Client(client, stateMachineWrapper, stateMachinePrefix)
  }
}

class Client(client: AWSStepFunctionsAsync, stateMachineWrapper: StateMachineContainer, stateMachinePrefix: String) {

  private def startExecution(arn: String, input: String)(implicit ec: ExecutionContext): Response[StartExecutionResult] = convertErrors {
    AwsAsync(client.startExecutionAsync, new StartExecutionRequest().withStateMachineArn(arn).withInput(input))
  }

  def triggerExecution[T](input: T)(
    implicit
    ec: ExecutionContext,
    encoder: Encoder[T],
    stateWrapper: StateWrapper
  ): Response[StateMachineExecution] = {
    stateMachineWrapper
      .map(machine => startExecution(machine.arn, stateWrapper.wrap(input)))
      .map(StateMachineExecution.fromStartExecution)
  }

  def jobIdFromArn(arn: String): Option[String] = {
    PartialFunction.condOpt(arn.split(':').toList) {
      case "arn" :: "aws" :: "states" :: region :: accountId :: "execution" :: stateMachine :: executionId :: Nil =>
        s"${stateMachine.stripPrefix(stateMachinePrefix)}:$executionId"
    }
  }

  def arnFromJobId(jobId: String): String =
    s"arn:aws:states:eu-west-1:$AccountId:execution:$stateMachinePrefix$jobId"

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
