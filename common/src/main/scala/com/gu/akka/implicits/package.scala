package com.gu.akka

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}

package object implicits {

  implicit lazy val system: ActorSystem = ActorSystem()

  implicit lazy val materializer: Materializer = ActorMaterializer()
}
