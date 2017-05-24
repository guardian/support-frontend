package lib.stepfunctions

import akka.actor.ActorSystem
import cats.data.EitherT
import org.joda.time.DateTime
import org.scalatest.{BeforeAndAfterAll, MustMatchers, WordSpec}

import scala.concurrent.Future
import lib.stepfunctions.StateMachineErrors.{Fail, RetryWithNewMachine}
import org.scalatest.concurrent.ScalaFutures
import cats.implicits._

class StateMachineContainerTest extends WordSpec with MustMatchers with ScalaFutures with BeforeAndAfterAll {

  implicit val system = ActorSystem("StateMachineContainerTest")
  implicit val ec = system.dispatcher

  "Invoke a supplied function with a state machine" in {
    val container = new StateMachineContainer(getResource)
    whenReady(container.map { machine => success(machine.arn) }.value) { _ mustEqual Right("arn-1") }
  }

  "Retry the function with new machine if first execution fails with retry request" in {
    val container = new StateMachineContainer(getResource)
    whenReady(container.map {
      thisThenThat(
        first = _ => failure(RetryWithNewMachine),
        subsequent = machine => success(machine.arn)
      )
    }.value) { _ mustEqual Right("arn-2") }
  }

  "Do not retry the function if the first execution returns non recoverable failure" in {
    val container = new StateMachineContainer(getResource)
    whenReady(container.map {
      thisThenThat(
        first = _ => failure(Fail),
        subsequent = machine => success(machine.arn)
      )
    }.value) { _ mustEqual Left(Fail) }
  }

  override def afterAll {
    system.terminate()
  }

  private def getResource: () => Future[Either[StateMachineError, StateMachine]] = {
    var counter = 0
    () => {
      counter = counter + 1
      Future.successful(StateMachine(s"arn-$counter", DateTime.now).asRight[StateMachineError])
    }
  }

  private def success(s: String): EitherT[Future, StateMachineError, String] =
    EitherT.fromEither[Future](s.asRight[StateMachineError])

  private def failure(f: StateMachineError): EitherT[Future, StateMachineError, String] =
    EitherT.fromEither[Future](f.asLeft[String])

  private def thisThenThat[T](first: StateMachine => T, subsequent: StateMachine => T): StateMachine => T = {
    var firstExecution = true
    (m: StateMachine) => {
      if (firstExecution) {
        firstExecution = false
        first(m)
      } else {
        subsequent(m)
      }
    }
  }
}
