package wiring

import org.apache.pekko.actor.ActorSystem
import play.api.{ApplicationLoader, BuiltInComponents, BuiltInComponentsFromContext}

import scala.concurrent.ExecutionContext

trait PlayComponents { self: BuiltInComponentsFromContext =>

  implicit val as: ActorSystem = actorSystem

}
