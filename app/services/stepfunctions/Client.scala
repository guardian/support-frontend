package services.stepfunctions

import com.amazonaws.services.stepfunctions.{AWSStepFunctionsAsync, AWSStepFunctionsAsyncClientBuilder}
import com.amazonaws.services.stepfunctions.model._
import services.aws.AwsAsync
import StateMachineContainer.{Response, convertErrors}
import akka.actor.ActorSystem
import scala.concurrent.ExecutionContext
import cats.implicits._
import com.amazonaws.regions.Regions
import services.aws.CredentialsProvider
import io.circe.Encoder
import io.circe.syntax._

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

  def triggerExecution[T](input: T)(implicit ec: ExecutionContext, encoder: Encoder[T]): Response[StateMachineExecution] = {
    stateMachineWrapper
      .map(machine => startExecution(machine.arn, input.asJson.noSpaces))
      .map(StateMachineExecution.fromStartExecution)
  }
}
