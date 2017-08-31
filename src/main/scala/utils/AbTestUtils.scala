package utils

import ophan.thrift.event.AbTest
import simulacrum._

@typeclass trait AbTestConverter[A] {
  @op("asAbTest") def asAbTest(a: A): AbTest
}