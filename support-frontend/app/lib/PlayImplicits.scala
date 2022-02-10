package lib

import java.util.UUID

import play.api.mvc.Request
import scala.util.Random

object PlayImplicits {

  private lazy val serverIdentifier = new Random().nextLong()

  implicit class RichRequest[T](request: Request[T]) {
    def uuid: UUID = new UUID(serverIdentifier, request.id)
  }
}
