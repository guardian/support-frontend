package services.stepfunctions

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.stepfunctions.model.{InvalidExecutionInputException, InvalidNameException, _}
import scala.concurrent.{ExecutionContext, Future}
import StateMachineErrors._

object StateMachineContainer {
  type Response[T] = EitherT[Future, StateMachineError, T]

  def convertErrors[T](response: Future[T])(implicit ec: ExecutionContext): Response[T] = EitherT {
    response.map(_.asRight[StateMachineError]).recover {
      case _: InvalidArnException => RetryWithNewMachine.asLeft
      case _: StateMachineDoesNotExistException => RetryWithNewMachine.asLeft
      case _: StateMachineDeletingException => RetryWithNewMachine.asLeft
      case _: ExecutionLimitExceededException => Fail.asLeft
      case _: ExecutionAlreadyExistsException => Fail.asLeft
      case _: InvalidExecutionInputException => Fail.asLeft
      case _: InvalidNameException => Fail.asLeft
    }
  }
}
