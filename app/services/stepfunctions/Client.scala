package services.stepfunctions

import services.aws.AwsAsync
import StateMachineContainer.{Response, convertErrors}
import akka.actor.ActorSystem
import cats.implicits._
import com.amazonaws.regions.Regions
import services.aws.CredentialsProvider
import com.amazonaws.services.stepfunctions.model._
import com.amazonaws.services.stepfunctions.{AWSStepFunctionsAsync, AWSStepFunctionsAsyncClientBuilder}
import io.circe.Encoder

import scala.concurrent.ExecutionContext

object Client {
  def apply(stateMachinePrefix: String, stage: String)(implicit system: ActorSystem): Client = {
    implicit val ec = system.dispatcher

    val client = AWSStepFunctionsAsyncClientBuilder.standard
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

    val stateMachineLookup = StateMachineLookup(stateMachinePrefix, stage)

    val stateMachineWrapper = new StateMachineContainer(() => stateMachineLookup.lookup(client))

    new Client(client, stateMachineWrapper)
  }
}

class Client(client: AWSStepFunctionsAsync, stateMachineWrapper: StateMachineContainer) {

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
}
