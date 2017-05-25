package lib.stepfunctions

import akka.actor.ActorSystem
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

class StateMachineContainer(getStateMachine: () => Future[Either[StateMachineError, StateMachine]])(implicit val system: ActorSystem) {

  import StateMachineContainer._

  private implicit val ec = system.dispatcher

  private val resourceManger = new ResourceManager(getStateMachine)

  def map[T](fn: StateMachine => Response[T]): Response[T] = {
    getMachine(refresh = false).flatMap { machine =>
      fn(machine).recoverWith {
        case RetryWithNewMachine => getMachine(refresh = true).flatMap(fn)
      }
    }
  }

  private def getMachine(refresh: Boolean): Response[StateMachine] = EitherT {
    resourceManger.get(refresh)
  }
}