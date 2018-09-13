package admin

import config.FastlyConfig

import scala.concurrent.ExecutionContext

class FastlyService(config: FastlyConfig)(implicit ec: ExecutionContext) {

  def purgeAll(): Either[Throwable, Unit] = ???
}
