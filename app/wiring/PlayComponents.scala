package wiring

import akka.actor.ActorSystem
import play.api.BuiltInComponents

import scala.concurrent.ExecutionContext

trait PlayComponents extends BuiltInComponents {

  implicit val ec: ExecutionContext = actorSystem.dispatcher
  implicit val as: ActorSystem = actorSystem

}