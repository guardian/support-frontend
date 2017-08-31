package utils

import ophan.thrift.event.AbTest
import simulacrum._

@typeclass trait AbTestConverter[A] {
  def asAbTest(a: A): AbTest
}