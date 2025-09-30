package services

import org.joda.time.DateTime
import software.amazon.awssdk.services.sfn.model.{StartExecutionResponse, StateMachineListItem}

package object stepfunctions {

  sealed trait StateMachineError

  object StateMachineErrors {

    object RetryWithNewMachine extends StateMachineError

    object Fail extends StateMachineError

    object NoStateMachineFound extends StateMachineError

  }

  case class StateMachine(arn: String, creationDate: DateTime)
  object StateMachine {
    def fromStateMachineListItem(item: StateMachineListItem): StateMachine = {
      StateMachine(item.stateMachineArn(), new DateTime(item.creationDate()))
    }
  }

  case class StateMachineExecution(arn: String, startTime: DateTime)

  object StateMachineExecution {
    def fromStartExecution(result: StartExecutionResponse): StateMachineExecution =
      StateMachineExecution(result.executionArn(), new DateTime(result.startDate()))
  }

  case class StateMachineExecutionStatus(
      input: String,
      output: String,
      startDate: DateTime,
      stopDate: Option[DateTime],
      status: String,
  )

}
