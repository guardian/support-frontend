package services

import com.amazonaws.services.stepfunctions.model.{StartExecutionResult, StateMachineListItem}
import org.joda.time.DateTime

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
      StateMachine(item.getStateMachineArn, new DateTime(item.getCreationDate))
    }
  }

  case class StateMachineExecution(arn: String, startTime: DateTime)

  object StateMachineExecution {
    def fromStartExecution(result: StartExecutionResult): StateMachineExecution =
      StateMachineExecution(result.getExecutionArn, new DateTime(result.getStartDate))
  }

  case class StateMachineExecutionStatus(
      input: String,
      output: String,
      startDate: DateTime,
      stopDate: Option[DateTime],
      status: String,
  )

}
