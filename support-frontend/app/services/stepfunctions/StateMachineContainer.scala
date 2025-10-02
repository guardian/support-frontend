package services.stepfunctions

import cats.data.EitherT
import cats.implicits._
import services.stepfunctions.StateMachineErrors._
import software.amazon.awssdk.services.sfn.model._

import scala.concurrent.{ExecutionContext, Future}

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
