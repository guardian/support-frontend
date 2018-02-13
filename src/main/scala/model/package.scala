import cats.data.Validated

import model.InitializationError

package object model {
  type InitializationResult[A] = Validated[InitializationError, A]
}
