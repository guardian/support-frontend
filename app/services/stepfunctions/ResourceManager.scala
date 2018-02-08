package services.stepfunctions

import akka.actor.{Actor, ActorSystem, Props}

import scala.concurrent.{Future, Promise}
import scala.util.{Failure, Success, Try}
import akka.pattern.ask
import akka.util.Timeout

import scala.concurrent.duration._
import com.typesafe.scalalogging.LazyLogging
import monitoring.SentryLogging

case class ResourceRequest(refresh: Boolean)

class ResourceManagerActor[T](getResource: () => Future[T]) extends Actor with LazyLogging {

  implicit val ec = context.dispatcher

  private var promise = Promise.failed[T](new Exception())

  override def receive: Receive = {
    case _: ResourceRequest =>
      context.become(normalState)
      self forward ResourceRequest(refresh = true)
  }

  def normalState: Receive = {
    case resource: Try[T] if !promise.isCompleted =>
      promise.complete(resource)

    case _: Try[T] if promise.isCompleted =>
      logger.error(SentryLogging.noPii, s"$self received new resource when not requested")

    case ResourceRequest(true) if promise.isCompleted =>
      promise = Promise[T]
      getResource().map { resource =>
        self ! Success(resource)
      } recover {
        case error =>
          self ! Failure[T](error)
      }
      sender ! promise.future

    case _: ResourceRequest =>
      sender ! promise.future
  }
}

class ResourceManager[T](getResource: () => Future[T])(implicit val system: ActorSystem) {

  implicit val timeout = Timeout(30.seconds)

  implicit private val ec = system.dispatcher

  private val resourceManager = system.actorOf(Props(classOf[ResourceManagerActor[T]], getResource))

  def get(refresh: Boolean): Future[T] =
    (resourceManager ? ResourceRequest(refresh)).mapTo[Future[T]].flatMap(identity)
}