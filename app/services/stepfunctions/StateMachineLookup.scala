package services.stepfunctions

import com.amazonaws.services.stepfunctions.AWSStepFunctionsAsync
import com.amazonaws.services.stepfunctions.model.{ListStateMachinesRequest, ListStateMachinesResult, StateMachineListItem}
import services.aws.AwsAsync
import services.stepfunctions.StateMachineErrors.NoStateMachineFound

import scala.concurrent.Future
import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext
import cats.syntax.either._

object StateMachineLookup {
  def findMachine(items: List[StateMachineListItem], stateMachinePrefix: String): Either[StateMachineError, StateMachine] = {
    items
      .filter(_.getName.startsWith(stateMachinePrefix))
      .sortBy(-_.getCreationDate.getTime)
      .headOption
      .map(response => StateMachine.fromStateMachineListItem(response).asRight)
      .getOrElse(Left(NoStateMachineFound))
  }
}

case class StateMachineLookup(stateMachinePrefix: String) {
  private def listStateMachines(client: AWSStepFunctionsAsync): Future[ListStateMachinesResult] = // TODO: should handle pagination
    AwsAsync(client.listStateMachinesAsync, new ListStateMachinesRequest())

  def lookup(client: AWSStepFunctionsAsync)(implicit ec: ExecutionContext): Future[Either[StateMachineError, StateMachine]] =
    listStateMachines(client).map { response =>
      StateMachineLookup.findMachine(
        items = response.getStateMachines.toList,
        stateMachinePrefix = stateMachinePrefix
      )
    }
}