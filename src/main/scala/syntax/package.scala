import ophan.thrift.event.AbTestInfo
import utils.AbTestConverter

package object syntax {
  implicit final def iterableSyntax[A](as: Iterable[A]): IterableOps[A] = new IterableOps(as)
}

final class IterableOps[A](val as: Iterable[A]) extends AnyVal {
  def asAbTestInfo(implicit converter: AbTestConverter[A]): AbTestInfo = {
    AbTestInfo(as.map(converter.asAbTest).toSet)
  }
}