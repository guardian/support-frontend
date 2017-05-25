package lib.stepfunctions

import com.amazonaws.services.stepfunctions.{AWSStepFunctionsAsync, AWSStepFunctionsAsyncClientBuilder}
import com.amazonaws.services.stepfunctions.model._
import lib.aws.AwsAsync
import StateMachineContainer.{Response, convertErrors}
import akka.actor.ActorSystem
import scala.concurrent.ExecutionContext
import cats.implicits._

object Client {
  def apply(stateMachinePrefix: String, stage: String)(implicit system: ActorSystem): Client = {
    implicit val ec = system.dispatcher

    val client = AWSStepFunctionsAsyncClientBuilder.defaultClient()

    val stateMachineLookup = StateMachineLookup(stateMachinePrefix, stage)

    val stateMachineWrapper = new StateMachineContainer(() => stateMachineLookup.lookup(client))

    new Client(client, stateMachineWrapper)
  }
}

class Client(client: AWSStepFunctionsAsync, stateMachineWrapper: StateMachineContainer) {

  private def startExecution(arn: String, input: String)(implicit ec: ExecutionContext): Response[StartExecutionResult] = convertErrors {
    AwsAsync(client.startExecutionAsync, new StartExecutionRequest().withStateMachineArn(arn).withInput(input))
  }

  def triggerExecution(input: String)(implicit ec: ExecutionContext): Response[StateMachineExecution] = { // this should probably take a [T] and a Serializer[T]
    stateMachineWrapper
      .map(machine => startExecution(machine.arn, input))
      .map(StateMachineExecution.fromStartExecution)
  }
}
