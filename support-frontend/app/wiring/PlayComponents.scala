package wiring

import akka.actor.ActorSystem
import play.api.{ApplicationLoader, BuiltInComponents, BuiltInComponentsFromContext}

import scala.concurrent.ExecutionContext

trait PlayComponents { self: BuiltInComponentsFromContext =>

  implicit val as: ActorSystem = actorSystem

}
