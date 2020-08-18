import cats.data.Validated

package object model {
  type InitializationResult[A] = Validated[InitializationError, A]
}
