package model

import cats.kernel.Semigroup

// Models errors at App initialization
// e.g invalid config, errors with building required services
// TODO: should this take an optional underlying error?
case class InitializationError(message: String, underlying: Throwable = null) extends Exception {
  override val getMessage: String = Option(underlying).fold(message)(err => s"$message - ${err.getMessage}")
}

object InitializationError {

  // Allows InitializationError to used as the left type parameter of Validated[A, B]
  // Means initialization errors can be accumulated.
  implicit val initializationErrorSemiGroup: Semigroup[InitializationError] =
    Semigroup.instance((err1, err2) => InitializationError(s"${err1.getMessage} and ${err2.getMessage}"))
}
