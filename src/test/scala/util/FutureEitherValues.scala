package util

import cats.data.EitherT
import org.scalatest.EitherValues
import org.scalatest.concurrent.ScalaFutures

import scala.concurrent.Future

trait FutureEitherValues extends ScalaFutures with EitherValues {

  implicit class FutureEitherOps[A, B](data: EitherT[Future, A, B]) {
    def futureLeft: A = data.value.futureValue.left.value
    def futureRight: B = data.value.futureValue.right.value
  }
}
