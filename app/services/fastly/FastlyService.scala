package services.fastly

import config.FastlyConfig

class FastlyService(config: FastlyConfig) {

  def purgeSurrogateKey(key: String): Either[Throwable, Unit] = ???
}
